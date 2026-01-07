import { Routes, Route, Navigate } from 'react-router-dom';
import { PublicLayout } from './layouts/PublicLayout';
import { PrivateLayout } from './layouts/PrivateLayout';
import { LoginPage } from './pages/public/LoginPage';
import { FlowPage } from './pages/private/FlowPage';
import { TeleopePage } from './pages/private/TeleopePage';

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
        <Route path="/flow" element={<FlowPage />} />
        <Route path="/teleope" element={<TeleopePage />} />
      </Route>
    </Routes>
  );
}

export default App;
