import { connectLambda, getStore } from '@netlify/blobs';

// Scheduled function (see the [functions."deploy-debounce-check"] schedule in
// netlify.toml) that fires the real Netlify build hook at most once, once
// Sanity publishes go quiet for a while. Pairs with sanity-deploy-trigger.mjs,
// which just records that a publish happened instead of building right away.
//
// This only runs once a minute, so a short quiet period buys nothing — it
// previously sat at 45s, which is shorter than "Publier tout" can take to
// push several documents through. That let this check catch a lull *between*
// documents, fire a build early, then fire a second one for the rest. Set
// generously above any realistic multi-document publish burst instead.
const QUIET_PERIOD_MS = 3 * 60_000;

export async function handler(event) {
  connectLambda(event);

  const store = getStore('deploy-debounce');
  const pending = await store.get('pending', { type: 'json' });

  if (!pending) {
    return { statusCode: 200, body: 'nothing pending' };
  }

  if (Date.now() - pending.lastReceivedAt < QUIET_PERIOD_MS) {
    return { statusCode: 200, body: 'still receiving publishes, waiting' };
  }

  const buildHookUrl = process.env.NETLIFY_BUILD_HOOK_URL;
  if (!buildHookUrl) {
    console.error('deploy-debounce-check: NETLIFY_BUILD_HOOK_URL is not set');
    return { statusCode: 500, body: 'missing build hook url' };
  }

  try {
    const res = await fetch(buildHookUrl, { method: 'POST' });
    if (!res.ok) {
      console.error(`deploy-debounce-check: build hook returned ${res.status}`);
      return { statusCode: 502, body: 'build hook failed, will retry next run' };
    }

    // Only clear the pending flag once the build hook actually accepted the
    // trigger — on failure, leave it in place so the next scheduled run retries.
    await store.delete('pending');
    return { statusCode: 200, body: 'deploy triggered' };
  } catch (err) {
    console.error('deploy-debounce-check error:', err);
    return { statusCode: 500, body: 'error, will retry next run' };
  }
}
