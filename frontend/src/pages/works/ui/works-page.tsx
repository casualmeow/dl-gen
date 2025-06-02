import { MainPageLayout } from './main-layout';
import { AppSidebar } from 'widgets/sidebar';
import AppSidebarProvider from 'widgets/sidebar/ui/provider';
import { AppHeader } from 'widgets/header';
import { UploadProvider } from 'shared/ui/upload';

export function WorksPage() {
  return (
    <>
    <UploadProvider>
      <AppSidebarProvider>
        <AppSidebar />
        <div className="flex-1 grid grid-rows-[auto_1fr]">
          <AppHeader breadcrumbs={[{ label: 'Your works', href: '/' }]} withBorder={true}/>
          <MainPageLayout />
        </div>
      </AppSidebarProvider>
      </UploadProvider>
    </>
  );
}
