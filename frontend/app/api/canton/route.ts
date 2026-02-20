import { NextRequest, NextResponse } from 'next/server';

// Use 127.0.0.1 instead of localhost to avoid IPv6 resolution issues in Node.js
const CANTON_URL = 'http://127.0.0.1:7575';
const CANTON_TOKEN = process.env.NEXT_PUBLIC_LEDGER_TOKEN || '';

export async function POST(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const endpoint = searchParams.get('endpoint') || '/v1/create';
  const targetUrl = `${CANTON_URL}${endpoint}`;

  // Get token from request header or fall back to env
  const authHeader = request.headers.get('Authorization');
  const token = authHeader?.replace('Bearer ', '') || CANTON_TOKEN;

  try {
    const body = await request.json();

    console.log(`[Canton Proxy] POST ${targetUrl}`);
    console.log(`[Canton Proxy] Body:`, JSON.stringify(body).substring(0, 200));
    console.log(`[Canton Proxy] Using token:`, token.substring(0, 20) + '...');

    const response = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    const text = await response.text();
    console.log(`[Canton Proxy] Response ${response.status}:`, text.substring(0, 200));

    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = { raw: text };
    }

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error(`[Canton Proxy] Error connecting to ${targetUrl}:`, message);
    return NextResponse.json(
      { errors: [`Canton proxy failed: ${message}`], targetUrl },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const endpoint = searchParams.get('endpoint') || '/readyz';
  const targetUrl = `${CANTON_URL}${endpoint}`;

  try {
    const response = await fetch(targetUrl, {
      headers: {
        'Authorization': `Bearer ${CANTON_TOKEN}`,
      },
    });

    const data = await response.text();
    return new NextResponse(data, { status: response.status });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error(`[Canton Proxy] GET Error:`, message);
    return NextResponse.json(
      { errors: [`Canton proxy failed: ${message}`] },
      { status: 500 }
    );
  }
}
