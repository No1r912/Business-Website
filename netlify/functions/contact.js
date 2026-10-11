const VALID_SERVICES = [
  'Web Development',
  'IT Troubleshooting',
  'Python Scripting',
  'Linux Support',
  'Other'
];

const MAX_LENGTHS = {
  name: 80,
  email: 254,
  service: 60,
  businessName: 120,
  budget: 60,
  message: 2000
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 5;
const recentRequests = new Map();

function sanitizeText(value, maxLength) {
  const text = typeof value === 'string' ? value.trim().replace(/\s+/g, ' ') : '';
  if (!text) return '';
  return text.length > maxLength ? text.slice(0, maxLength) : text;
}

function jsonResponse(statusCode, payload) {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Access-Control-Allow-Origin': process.env.ALLOWED_ORIGIN || '*',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Methods': 'POST, OPTIONS'
    },
    body: JSON.stringify(payload)
  };
}

function getRequestIp(event) {
  const headerValue = event.headers && (event.headers['x-forwarded-for'] || event.headers['x-real-ip'] || event.headers['client-ip']);
  if (typeof headerValue === 'string' && headerValue.trim()) {
    return headerValue.split(',')[0].trim();
  }
  return 'unknown';
}

function rateLimit(event) {
  const ip = getRequestIp(event);
  const now = Date.now();
  const bucket = recentRequests.get(ip) || [];
  const recent = bucket.filter((timestamp) => now - timestamp < RATE_LIMIT_WINDOW_MS);

  recent.push(now);
  recentRequests.set(ip, recent);

  return recent.length > RATE_LIMIT_MAX_REQUESTS;
}

function validatePayload(rawBody) {
  if (!rawBody || typeof rawBody !== 'object' || Array.isArray(rawBody)) {
    return {
      ok: false,
      statusCode: 400,
      message: 'Request body must be a JSON object.'
    };
  }

  const name = sanitizeText(rawBody.name, MAX_LENGTHS.name);
  const email = sanitizeText(rawBody.email, MAX_LENGTHS.email).toLowerCase();
  const service = sanitizeText(rawBody.service, MAX_LENGTHS.service);
  const businessName = sanitizeText(rawBody.businessName, MAX_LENGTHS.businessName);
  const budget = sanitizeText(rawBody.budget, MAX_LENGTHS.budget);
  const message = sanitizeText(rawBody.message, MAX_LENGTHS.message);

  if (!name) {
    return { ok: false, statusCode: 400, message: 'Please provide your full name.' };
  }

  if (!EMAIL_PATTERN.test(email)) {
    return { ok: false, statusCode: 400, message: 'Please provide a valid email address.' };
  }

  if (!VALID_SERVICES.includes(service)) {
    return { ok: false, statusCode: 400, message: 'Please select a supported service.' };
  }

  if (!message) {
    return { ok: false, statusCode: 400, message: 'Please include a project or issue description.' };
  }

  return {
    ok: true,
    payload: {
      name,
      email,
      service,
      businessName,
      budget,
      message
    }
  };
}

async function deliverToNetlify(payload) {
  const siteId = process.env.NETLIFY_SITE_ID;
  const token = process.env.NETLIFY_PERSONAL_ACCESS_TOKEN;
  const formName = process.env.NETLIFY_FORM_NAME || 'zyphera-contact';

  if (!siteId || !token) {
    return {
      delivered: false,
      reason: 'Netlify delivery is not configured. Configure NETLIFY_SITE_ID and NETLIFY_PERSONAL_ACCESS_TOKEN before deployment.'
    };
  }

  const urls = [
    `https://api.netlify.com/api/v1/sites/${encodeURIComponent(siteId)}/submissions`,
    `https://api.netlify.com/api/v1/sites/${encodeURIComponent(siteId)}/forms/${encodeURIComponent(formName)}/submissions`,
    `https://api.netlify.com/api/v1/forms/${encodeURIComponent(formName)}/submissions`
  ];

  let lastError = null;

  for (const url of urls) {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          form_name: formName,
          ...payload
        })
      });

      if (response.ok) {
        return {
          delivered: true,
          status: response.status
        };
      }

      const responseText = await response.text();
      lastError = new Error(`Netlify API rejected the request (${response.status}): ${responseText}`);
    } catch (error) {
      lastError = error;
    }
  }

  return {
    delivered: false,
    reason: lastError ? lastError.message : 'Netlify delivery failed unexpectedly.'
  };
}

exports.handler = async function handler(event) {
  if (event.httpMethod === 'OPTIONS') {
    return jsonResponse(200, { success: true, message: 'CORS preflight OK.' });
  }

  if (event.httpMethod !== 'POST') {
    return jsonResponse(405, { success: false, message: 'Only POST requests are supported.' });
  }

  if (!event.body || event.body.length > 65536) {
    return jsonResponse(413, { success: false, message: 'Request payload is too large.' });
  }

  if (rateLimit(event)) {
    return jsonResponse(429, { success: false, message: 'Too many requests. Please wait a minute and try again.' });
  }

  let parsedBody;
  try {
    parsedBody = JSON.parse(event.body || '{}');
  } catch (error) {
    return jsonResponse(400, { success: false, message: 'Malformed JSON. Please check your form details and try again.' });
  }

  const validation = validatePayload(parsedBody);
  if (!validation.ok) {
    return jsonResponse(validation.statusCode, { success: false, message: validation.message });
  }

  try {
    const delivery = await deliverToNetlify(validation.payload);

    if (!delivery.delivered) {
      return jsonResponse(503, {
        success: false,
        message: delivery.reason || 'The enquiry delivery service is not configured. Please contact the site owner or configure Netlify secrets.'
      });
    }

    return jsonResponse(200, {
      success: true,
      message: 'Your enquiry has been submitted successfully.'
    });
  } catch (error) {
    return jsonResponse(500, {
      success: false,
      message: 'The enquiry could not be processed. Please try again in a moment.'
    });
  }
};

exports.validatePayload = validatePayload;
exports.deliverToNetlify = deliverToNetlify;
