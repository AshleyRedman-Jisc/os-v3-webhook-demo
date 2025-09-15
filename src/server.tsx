import { serveStatic } from 'hono/bun';
import * as z from 'zod/mini';
import { Hono } from 'hono';

import { accept, retrieve, verifySignature } from './data';
import { Document } from './components/document';
import { App } from './components/app';
import { seed } from './seed';

const app = new Hono();

app.get('/favicon.ico', serveStatic({ path: './public/favicon.ico' }));
app.get('/static/client.js', serveStatic({ path: './public/client.js' }));

app.get('/', function (c) {
    return c.html(
        <Document>
            <App />
        </Document>
    );
});

app.post('/give-me-data', async function (c) {
    const response = z.object({ survey: z.string(), response: z.any() });

    try {
        const rawBody = await c.req.text();
        const signature = c.req.header('X-Webhook-Signature');

        // {
        // rawBody: "{\"survey\":\"test\",\"response\":{\"cmfkwmr6o00013b7349vq3rfg\":89578}}",
        // signature: "t=1757939078,v1=bbb0c0ad039b29b3fd03ba35833e18efcaefaaa744993f6fc0464368008deb26",
        // }
        console.log({ rawBody, signature });

        if (!signature) {
            return c.json({ status: 'No signature provided' }, 400);
        }

        // our verificatiom
        const verified = verifySignature(rawBody, signature, process.env.WEBHOOK_SECRET!, 400);

        console.log({ verified });

        if (!verified) {
            return c.json({ status: 'Failed to verify' }, 400);
        }

        // their verifification
        const body = await c.req.json(); // we can not safely parse the body as we know...
        const { success, data, error } = response.safeParse(body);

        if (!success) {
            return c.json({ status: 'Bad data', error }, 400);
        }

        const saved = await accept(data);

        if (!saved) {
            return c.json({ status: 'Failed' }, 500);
        }

        return c.json({ status: 'ok' }, 200);
    } catch (error) {
        console.error('Unexpected error:', error);
        return c.json({ error: 'Internal Server Error' }, 500);
    }
});

app.get('/get-my-data', async function (c) {
    const data = await retrieve();
    return c.json(data);
});

seed.run();
console.log(process.env);

export default {
    port: 3001,
    fetch: app.fetch
};
