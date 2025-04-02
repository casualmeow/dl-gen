import { MainPageLayout } from './main-layout';
import { AppSidebar } from 'widgets/sidebar';
import AppSidebarProvider from 'widgets/sidebar/ui/provider';
import { AppHeader } from 'widgets/header';

export function WorksPage() {
  return (
    <>
      <AppSidebarProvider>
        <AppSidebar />
        <div className="flex flex-col w-full">
          <AppHeader breadcrumbs={[{ label: 'Your works', href: '/' }]} />
          <MainPageLayout />
        </div>
      </AppSidebarProvider>
    </>
  );
}
