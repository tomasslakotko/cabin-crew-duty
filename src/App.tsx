import { useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AppShell } from './components/layout/AppShell';
import { CateringPage } from './pages/CateringPage';
import { OrdersPage } from './pages/OrdersPage';
import { SeatMapPage } from './pages/SeatMapPage';
import { SummaryPage } from './pages/SummaryPage';
import { SettingsPage } from './pages/SettingsPage';
import { StockingPage } from './pages/StockingPage';

import { useFlightStore } from './stores/flightStore';

function LoadingScreen() {
  return (
    <div className="flex h-full items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="text-center">
        <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-navy border-t-transparent" />
        <p className="mt-4 text-sm text-gray-500">Loading flight data…</p>
      </div>
    </div>
  );
}

export default function App() {
  const initFlight = useFlightStore((s) => s.initFlight);
  const initialized = useFlightStore((s) => s.initialized);

  useEffect(() => {
    void initFlight();
  }, [initFlight]);

  if (!initialized) {
    return <LoadingScreen />;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppShell />}>
          <Route index element={<SeatMapPage />} />
          <Route path="orders" element={<OrdersPage />} />
          <Route path="stocking" element={<StockingPage />} />
          <Route path="catering" element={<CateringPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="summary" element={<SummaryPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
