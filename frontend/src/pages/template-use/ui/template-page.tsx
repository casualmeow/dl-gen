import { AppSidebar } from 'widgets/sidebar';
import { AppSidebarProvider } from 'widgets/sidebar';
import { AppHeader } from 'widgets/header';

export function TemplatePage() {
    return (
        <AppSidebarProvider>
        <AppHeader 
        breadcrumbs={[
            { label: 'Your works', href: '/' }, 
            { label: 'View', href: '/view/:fileId' },
            { label: 'Choose template'}]}
        />
        <AppSidebar />
        </AppSidebarProvider>
    );
    }