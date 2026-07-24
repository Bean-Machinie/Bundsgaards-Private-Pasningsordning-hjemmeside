import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import App from './App';

import './styles/theme.css';
import './styles/base.css';
import './styles/global.css';

const container = document.getElementById('root');
if (!container) throw new Error('Root element #root not found');

// StrictMode is intentionally omitted: its dev-only double-mount destroys and
// re-creates the keen-slider hero in a way that leaves it un-laid-out. This is
// a known keen-slider incompatibility, not an app bug.
createRoot(container).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
);
