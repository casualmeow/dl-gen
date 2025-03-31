import Cookies from 'js-cookie';
import { SidebarProvider, SidebarTrigger } from 'entities/components';
import { AppSidebar } from 'widgets/sidebar/ui/sidebar';

export default function Layout() {
  const defaultOpen = Cookies.get('sidebar_state') === 'true';

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <AppSidebar />
      <main>
        <SidebarTrigger />
      </main>
    </SidebarProvider>
  );
}
