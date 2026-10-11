const test = require('node:test');
const assert = require('node:assert/strict');
const { validatePayload } = require('./contact.js');

test('accepts a valid contact payload', () => {
  const result = validatePayload({
    name: 'Alex Smith',
    email: 'alex@example.com',
    service: 'Web Development',
    businessName: 'Northbridge Studio',
    budget: '$3,000 – $6,000',
    message: 'We need a renewal of our business website and improved enquiry flow.'
  });

  assert.equal(result.ok, true);
  assert.equal(result.payload.service, 'Web Development');
});

test('rejects missing required fields', () => {
  const result = validatePayload({
    email: 'alex@example.com',
    service: 'Web Development',
    message: 'Hello'
  });

  assert.equal(result.ok, false);
  assert.equal(result.statusCode, 400);
});

test('rejects invalid service selections', () => {
  const result = validatePayload({
    name: 'Alex Smith',
    email: 'alex@example.com',
    service: 'Consulting',
    message: 'Hello'
  });

  assert.equal(result.ok, false);
  assert.equal(result.message, 'Please select a supported service.');
});

test('rejects malformed email addresses', () => {
  const result = validatePayload({
    name: 'Alex Smith',
    email: 'not-an-email',
    service: 'Web Development',
    message: 'Hello'
  });

  assert.equal(result.ok, false);
  assert.equal(result.message, 'Please provide a valid email address.');
});
