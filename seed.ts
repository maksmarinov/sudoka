declare const process: { env: Record<string, string | undefined> };

export async function GET(): Promise<Response> {
  const key = process.env.RANDOM_ORG_KEY;
  if (!key) return Response.json({ error: 'RANDOM_ORG_KEY not set' }, { status: 500 });
  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 2500);
    const r = await fetch('https://api.random.org/json-rpc/4/invoke', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: ctrl.signal,
      body: JSON.stringify({
        jsonrpc: '2.0', method: 'generateIntegers', id: 1,
        params: { apiKey: key, n: 1, min: 0, max: 999999999, replacement: true }
      })
    });
    clearTimeout(t);
    const seed = (await r.json()).result.random.data[0];
    if (typeof seed !== 'number') throw new Error('bad response');
    return Response.json({ seed }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (e) {
    return Response.json({ error: 'random.org unavailable' }, { status: 502 });
  }
}