import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
    }

    const filePath = path.join(process.cwd(), 'data', 'emails.json');
    const raw = await fs.readFile(filePath, 'utf-8');
    const existing = JSON.parse(raw || '[]');
    const entry = { email, timestamp: new Date().toISOString() };
    existing.push(entry);
    await fs.writeFile(filePath, JSON.stringify(existing, null, 2));

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
