import { SidebarProvider, SidebarTrigger } from "entities/components"
import { AppSidebar } from "widgets/sidebar/ui/sidebar"

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main>
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
  )
}
