import { useEffect, useState } from 'hono/jsx';

type Data = Record<any, any>;

export function Watcher() {
    const [data, setData] = useState<Data[]>([]);

    useEffect(() => {
        async function fetchData() {
            try {
                const res = await fetch('/get-my-data');
                const json = (await res.json()) as Data[];
                setData(json);
            } catch (err) {
                console.error('Fetch error:', err);
            }
        }
        fetchData();
        const interval = setInterval(fetchData, 3000);
        return () => clearInterval(interval);
    }, []);

    return (
        <ul class="list-disc pl-5">
            {data.map((item) => (
                <li key={item.id}>
                    <div>ID:{item.id}.</div>
                    <pre>
                        <code>{item.data}</code>
                    </pre>
                </li>
            ))}
        </ul>
    );
}
