import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import App from './App';
import { SiteDataProvider } from './lib/sheet/provider';

import './styles/theme.css';
import './styles/base.css';
import './styles/global.css';

const container = document.getElementById('root');
if (!container) throw new Error('Root element #root not found');

// StrictMode is intentionally omitted: its dev-only double-mount destroys and
// re-creates the keen-slider hero in a way that leaves it un-laid-out. This is
// a known keen-slider incompatibility, not an app bug.
// The sheet-backed content wraps the router rather than sitting inside a page:
// the hours are in the footer on every route, so there is one fetch and one
// copy for the whole session, not one per page visit.
createRoot(container).render(
  <SiteDataProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </SiteDataProvider>,
);
