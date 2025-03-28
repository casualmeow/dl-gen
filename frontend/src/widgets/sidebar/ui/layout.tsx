import Cookies from "js-cookie"
import { SidebarProvider, SidebarTrigger } from "entities/components"
import { AppSidebar } from "widgets/sidebar/ui/sidebar"

export default function Layout({ children }: { children: React.ReactNode }) {
    
    const defaultOpen = Cookies.get("sidebar_state") === "true"

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <AppSidebar />
      <main>
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
  )
}
