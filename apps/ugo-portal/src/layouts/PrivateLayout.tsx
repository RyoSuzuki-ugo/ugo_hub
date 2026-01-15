import { Outlet } from 'react-router-dom';
import { useAuth } from '@repo/feature';
import { Button } from '@repo/shared-ui/components/button';
import { LogOut } from 'lucide-react';

export function PrivateLayout() {
  const { logout, operator } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <div className="fixed top-4 right-4 z-50 flex items-center gap-4">
        {operator && (
          <span className="text-sm text-gray-600">{operator.name || operator.email}</span>
        )}
        <Button variant="outline" size="sm" onClick={logout} className="flex items-center gap-2">
          <LogOut className="h-4 w-4" />
          ログアウト
        </Button>
      </div>
      <Outlet />
    </div>
  );
}
