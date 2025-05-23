import { AppSidebar } from "widgets/sidebar";
import { AppSidebarProvider } from 'widgets/sidebar';
import { AppHeader } from 'widgets/header';

export function ExploreTemplatesPage() {
    return (
        <AppSidebarProvider>
            <AppSidebar />
            <AppHeader 
            breadcrumbs={[
                { label: 'Your works', href: '/' }, 
                { label: 'Explore templates', href: '/explore' }
            ]}
            />
        </AppSidebarProvider>
    );
}
