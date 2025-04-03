import Cookies from 'js-cookie';
import { SidebarProvider } from 'entities/components';

export default function AppSidebarProvider({ children }: { children: React.ReactNode }) {
  const defaultOpen = Cookies.get('sidebar_state') === 'true';

  return <SidebarProvider defaultOpen={defaultOpen}>{children}</SidebarProvider>;
}
