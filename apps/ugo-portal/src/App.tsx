import { Routes, Route, Navigate } from 'react-router-dom';
import { PublicLayout } from './layouts/PublicLayout';
import { PrivateLayout } from './layouts/PrivateLayout';
import { LoginPage } from './pages/public/LoginPage';
import { DashboardPage } from './pages/private/DashboardPage';
import { OperatingPage } from './pages/private/OperatingPage';
import { PlanningPage } from './pages/private/PlanningPage';
import { ManagementPage } from './pages/private/ManagementPage';
import { FlowPage } from './pages/private/FlowPage';
import { TeleopePage } from './pages/private/TeleopePage';
import { UISamplePage } from './pages/private/UISamplePage';

function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route element={<PublicLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route index element={<Navigate to="/login" replace />} />
      </Route>

      {/* Private routes */}
      <Route element={<PrivateLayout />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/operating" element={<OperatingPage />} />
        <Route path="/planning" element={<PlanningPage />} />
        <Route path="/management" element={<ManagementPage />} />
        <Route path="/flow" element={<FlowPage />} />
        <Route path="/teleope" element={<TeleopePage />} />
        <Route path="/ui-sample" element={<UISamplePage />} />
      </Route>
    </Routes>
  );
}

export default App;
