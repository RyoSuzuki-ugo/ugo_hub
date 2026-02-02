import { Routes, Route, Navigate } from 'react-router-dom';

function App() {
  return (
    <div className="min-h-screen bg-background">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route index element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

function HomePage() {
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold mb-4">Mock QA Tool</h1>
      <p className="text-muted-foreground">Welcome to the Mock QA Tool application.</p>
    </div>
  );
}

export default App;
