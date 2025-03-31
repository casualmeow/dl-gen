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
import { Settings, Ellipsis, Briefcase, BookOpenText, BookDashed, LogIn } from 'lucide-react';
import { useSidebarView } from '../model/useSidebarView';
import { useNavigate } from 'react-router';
import { NavUser } from './navUser';
import { useAuth } from 'entities/user';

type MenuItem = {
  icon: React.ComponentType<{ size?: number }>;
  label: string;
  url: string;
};

export const AppSidebar = () => {
  const { setView } = useSidebarView();
  const navigate = useNavigate();
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
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <a href="/login" className="flex items-center gap-3">
                    <LogIn size={18} />
                    <span>Log in</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          )}
        </SidebarHeader>
        <SidebarMenu>
          <SidebarGroup>
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
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
};
