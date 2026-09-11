// POST /api/lead — receives the quote form, records TCPA consent evidence,
// and forwards the lead to wherever the agency wants it.
//
// Environment variables (Vercel → Project → Settings → Environment Variables):
//
//   LEAD_WEBHOOK_URL   Required. Any URL that accepts a JSON POST — a CRM
//                      webhook, Zapier/Make catch hook, or an email relay.
//                      Until it is set, the form returns 503 and the page
//                      tells the visitor to call instead.
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

  if (!name || phone.replace(/\D/g, '').length < 10 || !/^\d{5}$/.test(zip) || !dob) {
    return res.status(400).json({ error: 'Please check the highlighted fields.' });
  }
  if (!consent) {
    return res.status(400).json({ error: 'Please tick the consent box so we are allowed to call you back.' });
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

  if (!process.env.LEAD_WEBHOOK_URL) {
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
    consent: {
      given: true,
      timestamp: new Date().toISOString(),
      ip: ip,
      user_agent: req.headers['user-agent'] || '',
      page_url: body.page_url || req.headers.referer || '',
      text: String(body.consent_text || '')
    }
  };

  try {
    var fr = await fetch(process.env.LEAD_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(lead)
    });
    if (!fr.ok) throw new Error('webhook ' + fr.status);
  } catch (e) {
    console.error('lead forward failed', e && e.message);
    return res.status(502).json({ error: 'We could not send your request. Please call 1-888-957-3337 and we will take care of you.' });
  }

  return res.status(200).json({ ok: true });
};
