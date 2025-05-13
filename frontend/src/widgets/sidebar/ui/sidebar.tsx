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
import { SidebarViewProvider } from '../model/useSidebarView';
import { NavUser } from './navUser';
import { useAuth } from 'features/auth';
import { UnauthorizedUserHeader } from './unathorized';

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
  const { user, isAuthenticated } = useAuth();

  const menuItems: MenuItem[] = [
    {
      icon: Briefcase,
      label: 'My Projects',
      url: '/',
    },
    {
      icon: BookOpenText,
      label: 'Documentation',
      url: '/docs',
    },
    {
      icon: BookDashed,
      label: 'Explore Templates',
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
        <SidebarHeader>
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
        <SidebarMenu>
          <SidebarGroup className="pt-0">
            <SidebarGroupLabel>Sections</SidebarGroupLabel>
            {menuItems.map((item) => (
              <SidebarMenuItem key={item.label}>
                <SidebarMenuButton asChild>
                  <a href={item.url} className="flex font-medium items-center gap-3">
                    <item.icon size={18} />
                    <span>{item.label}</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarGroup>
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
};
