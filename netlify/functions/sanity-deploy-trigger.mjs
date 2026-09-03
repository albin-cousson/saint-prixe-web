import { connectLambda, getStore } from '@netlify/blobs';

// Receiver for the Sanity webhook. "Publier tout" in the Studio publishes
// each edited document as a separate mutation, so Sanity fires one webhook
// call per document — this endpoint doesn't build the site itself, it just
// records "a publish just happened" in Blobs. deploy-debounce-check.mjs runs
// on a schedule and fires the real Netlify build hook once, after publishes
// go quiet for a bit, collapsing a burst of N webhook calls into one deploy.
//
// Setup (see CLAUDE.md):
// 1. Netlify env vars: NETLIFY_BUILD_HOOK_URL (the real build hook), and
//    optionally SANITY_DEPLOY_WEBHOOK_SECRET (any random string).
// 2. In manage.sanity.io, add a webhook pointing at this function's URL
//    (…/.netlify/functions/sanity-deploy-trigger). If a secret is set above,
//    add a custom HTTP header on the webhook: `x-webhook-secret: <the secret>`.
export async function handler(event) {
  connectLambda(event);

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method not allowed' };
  }

  const expectedSecret = process.env.SANITY_DEPLOY_WEBHOOK_SECRET;
  if (expectedSecret && event.headers['x-webhook-secret'] !== expectedSecret) {
    return { statusCode: 401, body: 'Unauthorized' };
  }

  try {
    const store = getStore('deploy-debounce');
    await store.setJSON('pending', { lastReceivedAt: Date.now() });
    return { statusCode: 200, body: 'queued' };
  } catch (err) {
    console.error('sanity-deploy-trigger error:', err);
    return { statusCode: 500, body: 'error' };
  }
}
