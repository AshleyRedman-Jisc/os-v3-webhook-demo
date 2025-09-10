import { useEffect, useState } from 'hono/jsx';

export function Watcher() {
    const [data, setData] = useState<string[]>([]);

    useEffect(() => {
        async function fetchData() {
            try {
                const res = await fetch('/data');
                const json = (await res.json()) as { data: string };
                setData((prev) => [...prev, json.data]);
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
            {data.map((item, index) => (
                <li key={index}>
                    {index + 1}. {item}
                </li>
            ))}
        </ul>
    );
}
