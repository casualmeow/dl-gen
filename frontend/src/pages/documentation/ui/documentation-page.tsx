import { AppSidebar, AppSidebarProvider } from 'widgets/sidebar';
import { AppHeader } from 'widgets/header';
import DocumentationContent from './documentation.mdx';
import { useTranslation } from 'react-i18next';

export function DocumentationPage() {
  const { t } = useTranslation();
  return (
    <AppSidebarProvider>
      <AppSidebar />
      <div className="flex-1 grid grid-rows-[auto_1fr]">
        <AppHeader
          breadcrumbs={[
            { label: t('works.breadcrumb'), href: '/' },
            { label: t('sidebar.documentation'), href: '/docs' },
          ]}
          withBorder={true}
        />
        <div className="container mx-auto py-8 px-2 md:px-8">
          <DocumentationContent />
        </div>
      </div>
    </AppSidebarProvider>
  );
} 