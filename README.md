# Zyphera Digital

A lightweight static website for Zyphera Digital, built with plain HTML, CSS, and JavaScript.

## Local development

1. Open the project folder in a browser, or run a local static server:
   `python -m http.server 8000`
2. Visit `http://localhost:8000` in your browser.

## Backend and contact delivery

This project remains a static frontend, but it now includes a Netlify Functions backend for server-side contact processing.

- Contact submissions are posted to `/.netlify/functions/contact`.
- The function validates the request server-side and rejects missing or malformed data.
- It supports a lightweight rate limit and server-side security checks.
- It attempts to deliver valid submissions through the Netlify Forms API when `NETLIFY_SITE_ID` and `NETLIFY_PERSONAL_ACCESS_TOKEN` are configured.
- If those environment variables are not configured, the function returns a clear error instead of falsely reporting success.

## Required environment variables

Copy `.env.example` and populate the values in Netlify Environment Variables:

- `NETLIFY_SITE_ID`
- `NETLIFY_PERSONAL_ACCESS_TOKEN`
- `NETLIFY_FORM_NAME` (optional; defaults to `zyphera-contact`)
- `ALLOWED_ORIGIN` (optional; set to your production domain for CORS)

Do not commit real secret values to the repository.

## Local testing

1. Run a local static server from the project root: `python -m http.server 8000`
2. Submit the form in the browser.
3. For deterministic server-side validation tests, run: `node --test netlify/functions/contact.test.js`

## Deployment

This site is suitable for static hosting on Netlify or similar providers.

- Ensure `favicon.svg` is included in the site root.
- Keep the contact form configured with `data-netlify="true"` and a hidden honeypot field for Netlify detection.
- Add the environment variables in Netlify before testing a real submission.
- The `thank-you.html` page remains as a success destination once the form has been accepted by the backend.

## Project structure

- `index.html` — page structure and content
- `script.js` — navigation, reveals, and form validation
- `css/` — styling files
- `favicon.svg` — site icon