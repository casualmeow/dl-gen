import { MainPageLayout } from './main-layout';
import { AppSidebar } from 'widgets/sidebar';
import AppSidebarProvider from 'widgets/sidebar/ui/provider';
import { AppHeader } from 'widgets/header';
import { UploadProvider } from 'shared/ui/upload';
import { ToastProvider } from 'shared/ui/upload/api/toast-provider';
import { useTranslation } from 'react-i18next';

export function WorksPage() {
  const { t } = useTranslation();
  return (
    <>
    <ToastProvider>
      <UploadProvider>
        <AppSidebarProvider>
          <AppSidebar />
          <div className="flex-1 grid grid-rows-[auto_1fr]">
            <AppHeader breadcrumbs={[{ label: t('works.breadcrumb'), href: '/' }]} withBorder={true}/>
            <MainPageLayout />
          </div>
        </AppSidebarProvider>
      </UploadProvider>
    </ToastProvider>
    </>
  );
}
