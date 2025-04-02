import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarHeader,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
} from 'entities/components';
import { Briefcase, BookOpenText, BookDashed } from 'lucide-react';
import { SidebarViewProvider, useSidebarView } from '../model/useSidebarView';
import { NavUser } from './navUser';
import { useAuth } from 'entities/user';
import { UnauthorizedUserHeader } from './unathorized';
import { SidebarSettings } from './settings';

type MenuItem = {
  icon: React.ComponentType<{ size?: number }>;
  label: string;
  url: string;
};

export const AppSidebar = () => {
  return (
    <SidebarViewProvider>
      <AppSidebarContent />
    </SidebarViewProvider>
  );
};

const AppSidebarContent = () => {
  const { view, setView } = useSidebarView();
  const { user, isAuthenticated } = useAuth();

  const menuItems: MenuItem[] = [
    {
      icon: Briefcase,
      label: 'My works',
      url: '/',
    },
    {
      icon: BookOpenText,
      label: 'documentation',
      url: '/docs',
    },
    {
      icon: BookDashed,
      label: 'Explore templates',
      url: '/explore',
    },

    // { TOOD: decompose into header
    //   icon: <Settings />,
    //   label: "Settings",
    //   onClick: () => setView("settings")
    // }
  ];

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarHeader className='pt-5'>
          {isAuthenticated ? (
            <NavUser
              user={{
                name: user?.full_name || user?.username || '',
                email: user?.email || '',
                avatar: '',
              }}
            />
          ) : (
            <UnauthorizedUserHeader />
          )}
        </SidebarHeader>
        {view === 'settings' ? (
          <SidebarSettings showBack={true} onBack={() => setView('main')} />
        ) : (
          <SidebarMenu>
            <SidebarGroup className="pt-0">
              <SidebarGroupLabel>Sections</SidebarGroupLabel>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.label}>
                  <SidebarMenuButton asChild>
                    <a href={item.url} className="flex items-center gap-3">
                      <item.icon size={18} />
                      <span>{item.label}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarGroup>
          </SidebarMenu>
        )}
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
};
