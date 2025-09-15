import { db } from './db';
import * as crypto from 'crypto';

export async function accept(data: Record<any, any>) {
    try {
        const query = db.query('insert into responses (data) values (:value)');
        query.run({ value: JSON.stringify(data) });
        return true;
    } catch (error) {
        return false;
    }
}

export async function retrieve() {
    const query = db.query('select * from responses;');
    return query.all();
}

export function verifySignature(body: string, header: string, secret: string, toleranceSeconds = 300): boolean {
    if (!header) return false;

    // Example header: "t=1699999999,v1=abcdef123..."
    const parts = Object.fromEntries(header.split(',').map((p) => p.split('=')));
    const timestamp = parseInt(parts['t'], 10);
    const signature = parts['v1'];

    if (!timestamp || !signature) return false;

    // Check replay window
    const now = Math.floor(Date.now() / 1000);
    if (Math.abs(now - timestamp) > toleranceSeconds) {
        return false; // request too old/new
    }

    // Recompute signature
    const signedPayload = `${timestamp}.${body}`;
    const expected = crypto.createHmac('sha256', secret).update(signedPayload).digest('hex');

    // Use constant-time comparison
    return crypto.timingSafeEqual(Buffer.from(expected, 'utf8'), Buffer.from(signature, 'utf8'));
}
