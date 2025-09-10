import { PropsWithChildren } from 'hono/jsx';

export function Document({ children }: PropsWithChildren) {
    return (
        <html>
            <body>
                <head>
                    <meta charset="UTF-8" />
                    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                    <link rel="icon" type="image/x-icon" href="/favicon.ico" />
                    <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
                    <script type="module" src="/static/client.js"></script>
                </head>
                <main
                    id="root"
                    class="container mx-auto px-4 border border-red-200 flex items-center h-2/3 justify-center my-24"
                >
                    {children}
                </main>
            </body>
        </html>
    );
}
