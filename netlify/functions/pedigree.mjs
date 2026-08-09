// Proxies a pedigree PDF from Sanity's asset CDN and forces a real download via
// Content-Disposition — Sanity's CDN rejects cross-origin fetch() from the browser
// (403), so the browser's own `download` attribute never actually applies. Only
// cdn.sanity.io/files URLs are allowed through, to avoid becoming an open proxy.
const ALLOWED_URL = /^https:\/\/cdn\.sanity\.io\/files\/[a-z0-9]+\/[a-z0-9._-]+\/[a-zA-Z0-9._-]+$/;

export async function handler(event) {
  const url = event.queryStringParameters?.url;
  const filename = (event.queryStringParameters?.filename || 'pedigree.pdf').replace(/"/g, '');

  if (!url || !ALLOWED_URL.test(url)) {
    return { statusCode: 400, body: 'Invalid url' };
  }

  try {
    const res = await fetch(url);
    if (!res.ok) return { statusCode: 502, body: 'Upstream error' };

    const buffer = Buffer.from(await res.arrayBuffer());
    return {
      statusCode: 200,
      headers: {
        'Content-Type': res.headers.get('content-type') || 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
      body: buffer.toString('base64'),
      isBase64Encoded: true,
    };
  } catch (err) {
    console.error('pedigree proxy error:', err);
    return { statusCode: 500, body: 'error' };
  }
}
