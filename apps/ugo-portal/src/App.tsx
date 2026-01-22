import { Routes, Route, Navigate } from 'react-router-dom';
import { PublicLayout } from './layouts/PublicLayout';
import { PrivateLayout } from './layouts/PrivateLayout';
import { SimpleLayout } from './layouts/SimpleLayout';
import { LoginPage } from './pages/public/LoginPage';
import { DashboardPage } from './pages/private/dashboard/DashboardPage';
import { OperatingPage } from './pages/private/operating/OperatingPage';
import { PlanningPage } from './pages/private/planning/PlanningPage';
import { ManagementPage } from './pages/private/management/ManagementPage';
import { SystemSettingsPage } from './pages/private/system-settings/SystemSettingsPage';
import { InitialSetupPage } from './pages/private/planning/setup/InitialSetupPage';
import { MapEditorPage } from './pages/private/planning/map-editor/MapEditorPage';
import { FlowPage } from './pages/private/planning/flow/FlowPage';
import { TeleopePage } from './pages/private/operating/teleope/TeleopePage';
import { MonitoringPage } from './pages/private/monitoring/MonitoringPage';

function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route element={<PublicLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route index element={<Navigate to="/login" replace />} />
      </Route>

      {/* Private routes with sidebar */}
      <Route element={<PrivateLayout />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/operating" element={<OperatingPage />} />
        <Route path="/planning" element={<PlanningPage />} />
        <Route path="/management" element={<ManagementPage />} />
        <Route path="/system-settings" element={<SystemSettingsPage />} />
        <Route path="/setup/initial" element={<InitialSetupPage />} />
        <Route path="/flow" element={<FlowPage />} />
        <Route path="/teleope" element={<TeleopePage />} />
      </Route>

      {/* Private routes without sidebar (full screen) */}
      <Route element={<SimpleLayout />}>
        <Route path="/map-editor" element={<MapEditorPage />} />
        <Route path="/map-editor/:floorId" element={<MapEditorPage />} />
        <Route path="/monitoring" element={<MonitoringPage />} />
      </Route>
    </Routes>
  );
}

export default App;
