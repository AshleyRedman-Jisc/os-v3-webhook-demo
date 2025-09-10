import { serveStatic } from 'hono/bun';
import * as z from 'zod/mini';
import { Hono } from 'hono';

import { Document } from './components/document';
import { accept, retrieve } from './data';
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
    const response = z.object({ id: z.string(), response: z.string() });

    try {
        const body = await c.req.json();
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

export default {
    port: 3001,
    fetch: app.fetch
};
