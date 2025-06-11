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
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from 'entities/components';
import { Briefcase, BookOpenText, BookDashed } from 'lucide-react';
import { SidebarViewProvider } from '../model/useSidebarView';
import { NavUser } from './navUser';
import { useAuth } from 'features/auth';
import { UnauthorizedUserHeader } from './unathorized';
import { useTranslation } from 'react-i18next';

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
  const { t, i18n } = useTranslation();

  const menuItems: MenuItem[] = [
    {
      icon: Briefcase,
      label: t('sidebar.myProjects'),
      url: '/',
    },
    {
      icon: BookOpenText,
      label: t('sidebar.documentation'),
      url: '/docs',
    },
    {
      icon: BookDashed,
      label: t('sidebar.exploreTemplates'),
      url: '/templates',
    },

    // { TOOD: decompose into header
    //   icon: <Settings />,
    //   label: "Settings",
    //   onClick: () => setView("settings")
    // }
  ];

  const handleLanguageChange = (lng: string) => {
    i18n.changeLanguage(lng);
  };

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
            <SidebarGroupLabel>{t('sidebar.sections')}</SidebarGroupLabel>
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
      <SidebarFooter>
        <div className="p-4">
          <Select value={i18n.language} onValueChange={handleLanguageChange}>
            <SelectTrigger className="w-full">
              <SelectValue>{t('language')}: {i18n.language === 'en' ? 'EN' : 'УКР'}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">EN</SelectItem>
              <SelectItem value="uk">УКР</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};
