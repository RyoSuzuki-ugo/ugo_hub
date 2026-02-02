import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@repo/feature';
import { Button } from '@repo/shared-ui/components/button';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from '@repo/shared-ui/components/sidebar';
import { LogOut, Settings, Building2, Calendar, Home, MonitorPlay, TestTube2 } from 'lucide-react';

export function PrivateLayout() {
  const { logout, operator } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { path: '/dashboard', label: 'ダッシュボード', description: '各種統計情報など', icon: Home },
    { path: '/operating', label: 'オペレーティング', description: 'ロボット操作・レポートなど', icon: MonitorPlay },
    { path: '/planning', label: 'プランニング', description: '業務計画', icon: Calendar },
    { path: '/management', label: 'マネジメント', description: '管理機能', icon: Building2 },
    { path: '/system-settings', label: 'システム設定', description: 'システム管理', icon: Settings },
    { path: 'http://localhost:4004', label: 'Mock QA Tool', description: 'QAモックツール', icon: TestTube2, external: true },
  ];

  const isActive = (path: string) => location.pathname.startsWith(path);

  return (
    <SidebarProvider defaultOpen={true}>
      <Sidebar collapsible="icon">
        <SidebarHeader>
          <div className="flex items-center justify-between px-2 py-2 group-data-[collapsible=icon]:justify-center">
            <div className="flex-1 group-data-[collapsible=icon]:hidden">
              <h1 className="text-lg font-bold">ugo portal</h1>
              {operator && (
                <p className="text-xs text-muted-foreground mt-1">
                  {(operator as any).name || `${operator.lastName || ''}${operator.firstName || ''}`}
                </p>
              )}
            </div>
            <SidebarTrigger />
          </div>
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const handleClick = () => {
                    if ('external' in item && item.external) {
                      window.open(item.path, '_blank');
                    } else {
                      navigate(item.path);
                    }
                  };
                  return (
                    <SidebarMenuItem key={item.path}>
                      <SidebarMenuButton
                        onClick={handleClick}
                        className={`group-data-[collapsible=icon]:justify-center ${
                          isActive(item.path)
                            ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                            : ''
                        }`}
                        title={item.label}
                      >
                        <Icon />
                        <div className="group-data-[collapsible=icon]:hidden flex flex-col">
                          <span className="text-sm font-medium">{item.label}</span>
                          <span className="text-xs text-muted-foreground">{item.description}</span>
                        </div>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter>
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={logout}
            title="ログアウト"
          >
            <LogOut className="h-4 w-4 mr-2" />
            <span className="group-data-[collapsible=icon]:hidden">ログアウト</span>
          </Button>
        </SidebarFooter>
      </Sidebar>

      <SidebarInset>
        <Outlet />
      </SidebarInset>
    </SidebarProvider>
  );
}
