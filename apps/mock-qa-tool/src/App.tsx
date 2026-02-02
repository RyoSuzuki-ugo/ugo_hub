import { Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from './layouts/MainLayout';
import { InspectionExecutePage } from './pages/InspectionExecutePage';
import { InspectionHistoryPage } from './pages/InspectionHistoryPage';
import { InspectionSessionPage } from './pages/InspectionSessionPage';

function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/execute" element={<InspectionExecutePage />} />
        <Route path="/history" element={<InspectionHistoryPage />} />
        <Route path="/" element={<Navigate to="/execute" replace />} />
      </Route>
      {/* セッションページはレイアウトなしで全画面表示 */}
      <Route path="/session" element={<InspectionSessionPage />} />
    </Routes>
  );
}

export default App;
