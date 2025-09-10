import { render } from 'hono/jsx/dom';
import { App } from './components/app';

const root = document.getElementById('root');

if (root) {
    render(<App />, root);
}
