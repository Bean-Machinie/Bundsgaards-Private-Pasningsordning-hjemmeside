import { Navigate, Route, Routes } from 'react-router-dom';

import Layout from './components/Layout';
import ScrollToTop from './components/ScrollToTop';
import Forside from './pages/Forside';
import Galleri from './pages/Galleri';
import Hverdagen from './pages/Hverdagen';
import Kontakt from './pages/Kontakt';
import OmBundsgaard from './pages/OmBundsgaard';
import OmMig from './pages/OmMig';
import Praktisk from './pages/Praktisk';
import Vaerdier from './pages/Vaerdier';
import { routes } from './routes';

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route element={<Layout />}>
          <Route path={routes.forside.path} element={<Forside />} />
          <Route path={routes.om.path} element={<OmBundsgaard />} />
          <Route path={routes.hverdagen.path} element={<Hverdagen />} />
          <Route path={routes.vaerdier.path} element={<Vaerdier />} />
          <Route path={routes.ommig.path} element={<OmMig />} />
          <Route path={routes.praktisk.path} element={<Praktisk />} />
          <Route path={routes.galleri.path} element={<Galleri />} />
          <Route path={routes.kontakt.path} element={<Kontakt />} />
          <Route path="*" element={<Navigate to={routes.forside.path} replace />} />
        </Route>
      </Routes>
    </>
  );
}
