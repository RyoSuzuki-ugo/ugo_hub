import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from '@repo/shared-ui/components/sidebar';
import { History, PlayCircle } from 'lucide-react';

export function MainLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { path: '/execute', label: '検査実施', icon: PlayCircle },
    { path: '/history', label: '検査履歴一覧', icon: History },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <SidebarProvider defaultOpen={true}>
      <Sidebar collapsible="icon">
        <SidebarHeader>
          <div className="flex items-center justify-between px-2 py-2 group-data-[collapsible=icon]:justify-center">
            <div className="flex-1 group-data-[collapsible=icon]:hidden">
              <h1 className="text-lg font-bold">Mock QA Tool</h1>
              <p className="text-xs text-muted-foreground mt-1">品質検査ツール</p>
            </div>
            <SidebarTrigger />
          </div>
        </SidebarHeader>

        <SidebarContent>
          <SidebarMenu>
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton
                    onClick={() => navigate(item.path)}
                    className={`group-data-[collapsible=icon]:justify-center ${
                      isActive(item.path)
                        ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                        : ''
                    }`}
                    title={item.label}
                  >
                    <Icon />
                    <span className="group-data-[collapsible=icon]:hidden">{item.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>

      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <div className="flex-1">
            <h2 className="text-lg font-semibold">
              {menuItems.find((item) => isActive(item.path))?.label || 'Mock QA Tool'}
            </h2>
          </div>
        </header>
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
