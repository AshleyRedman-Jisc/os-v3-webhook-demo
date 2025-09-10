import { serveStatic } from 'hono/bun';
import { Hono } from 'hono';

import { Document } from './components/document';
import { App } from './components/app';

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

app.get('/data', function (c) {
    return c.json({ data: '123' });
});

export default {
    port: 3001,
    fetch: app.fetch
};
