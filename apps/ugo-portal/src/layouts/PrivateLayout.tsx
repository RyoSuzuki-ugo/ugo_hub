import { Outlet } from 'react-router-dom';

export function PrivateLayout() {
  // TODO: Add authentication check
  return (
    <div className="min-h-screen bg-background">
      <Outlet />
    </div>
  );
}
