// POST /api/lead — receives the quote form, records TCPA consent evidence,
// and forwards the lead to wherever the agency wants it.
//
// Environment variables (Vercel → Project → Settings → Environment Variables).
// Set ONE of the two delivery options; both may be set.
//
//   Option 1 — email the lead (simplest):
//   RESEND_API_KEY     API key from resend.com (free account).
//   LEAD_TO_EMAIL      Inbox that receives leads. Until a sending domain is
//                      verified in Resend, this must be the email the Resend
//                      account was created with.
//   LEAD_FROM_EMAIL    Optional. Defaults to onboarding@resend.dev, which
//                      works without domain verification.
//
//   Option 2 — POST the lead as JSON somewhere:
//   LEAD_WEBHOOK_URL   Any URL that accepts a JSON POST — a CRM webhook, a
//                      Make.com / Zapier catch hook, a Google Apps Script.
//
//   Until one of them is set, the form returns 503 and the page tells the
//   visitor to call instead.
//
//   TURNSTILE_SECRET   Optional. Cloudflare Turnstile secret key. When set,
//                      every submission must carry a valid Turnstile token
//                      (the site key goes in assets/site.js).
//
// Consent evidence stored with every lead: timestamp, IP, user agent, page
// URL, and the exact consent text the visitor saw. That is what a TCPA
// dispute asks for.

'use strict';

module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  var body = req.body || {};
  if (typeof body === 'string') { try { body = JSON.parse(body); } catch (e) { body = {}; } }

  // Honeypot: real people never see this field.
  if (body.website) return res.status(200).json({ ok: true });

  var name = String(body.name || '').trim();
  var phone = String(body.phone || '').replace(/[^\d+]/g, '');
  var zip = String(body.zip || '').trim();
  var dob = String(body.dob || '').trim();
  var consent = body.consent === 'yes' || body.consent === true;
  var consentText = String(body.consent_text || '').trim();

  if (!name || phone.replace(/\D/g, '').length < 10 || !/^\d{5}$/.test(zip) || !dob) {
    return res.status(400).json({ error: 'Please check the highlighted fields.' });
  }
  if (!consent) {
    return res.status(400).json({ error: 'Please tick the consent box so we are allowed to call you back.' });
  }
  // A consent record without the disclosure the visitor actually saw is not
  // evidence of anything, so a submission that omits it is refused.
  if (!consentText) {
    return res.status(400).json({ error: 'We could not record your consent. Please reload the page and try again, or call 1-888-957-3337.' });
  }

  var ip = (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || req.socket?.remoteAddress || '';

  if (process.env.TURNSTILE_SECRET) {
    var ok = false;
    try {
      var vr = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ secret: process.env.TURNSTILE_SECRET, response: body.turnstile || '', remoteip: ip })
      });
      ok = (await vr.json()).success === true;
    } catch (e) { ok = false; }
    if (!ok) return res.status(400).json({ error: 'Verification failed. Please try again or call 1-888-957-3337.' });
  }

  var canEmail = !!(process.env.RESEND_API_KEY && process.env.LEAD_TO_EMAIL);
  var canPost = !!process.env.LEAD_WEBHOOK_URL;
  if (!canEmail && !canPost) {
    return res.status(503).json({ error: 'Online requests are not available right now. Please call 1-888-957-3337 and we will take care of you.' });
  }

  var lead = {
    source: 'ssifinalexpense.com',
    received_at: new Date().toISOString(),
    name: name,
    phone: phone,
    zip: zip,
    dob: dob,
    estimator: {
      age: body.ssi_age || null,
      gender: body.ssi_gender || null,
      coverage: body.ssi_coverage || null,
      tobacco: body.ssi_tobacco || null
    },
    // TCPA consent record. Stored with every lead, verbatim, so a dispute can
    // be answered from the lead itself: when, from where, on which page, and
    // exactly what the visitor agreed to. The text is the text, not a pointer.
    consent: {
      given: true,
      method: 'unchecked checkbox, ticked by the visitor before submit',
      timestamp_utc: new Date().toISOString(),
      ip: ip,
      user_agent: req.headers['user-agent'] || '',
      page_url: body.page_url || req.headers.referer || '',
      text: consentText
    }
  };

  var delivered = false;

  if (canEmail) {
    try {
      var est = lead.estimator;
      var text = [
        'New quote request from ssifinalexpense.com',
        '',
        'Name:   ' + lead.name,
        'Phone:  ' + lead.phone,
        'ZIP:    ' + lead.zip,
        'DOB:    ' + lead.dob,
        '',
        est.age ? 'Estimator: age ' + est.age + ', ' + est.gender + ', $' + est.coverage + ' coverage, tobacco ' + est.tobacco : 'Estimator: not used',
        '',
        '-- TCPA consent evidence --',
        'Time (UTC): ' + lead.consent.timestamp_utc,
        'Method:     ' + lead.consent.method,
        'IP:         ' + lead.consent.ip,
        'Page:       ' + lead.consent.page_url,
        'User agent: ' + lead.consent.user_agent,
        'Consent text shown:',
        lead.consent.text
      ].join('\n');
      var er = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { 'Authorization': 'Bearer ' + process.env.RESEND_API_KEY, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: process.env.LEAD_FROM_EMAIL || 'SSI Website <onboarding@resend.dev>',
          to: [process.env.LEAD_TO_EMAIL],
          subject: 'New lead: ' + lead.name + ' - ' + lead.phone,
          text: text
        })
      });
      if (!er.ok) throw new Error('resend ' + er.status + ' ' + (await er.text()).slice(0, 200));
      delivered = true;
    } catch (e) {
      console.error('lead email failed', e && e.message);
    }
  }

  if (canPost) {
    try {
      var fr = await fetch(process.env.LEAD_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(lead)
      });
      if (!fr.ok) throw new Error('webhook ' + fr.status);
      delivered = true;
    } catch (e) {
      console.error('lead forward failed', e && e.message);
    }
  }

  if (!delivered) {
    return res.status(502).json({ error: 'We could not send your request. Please call 1-888-957-3337 and we will take care of you.' });
  }
  return res.status(200).json({ ok: true });
};
