import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarMenu,
    SidebarHeader,
    SidebarMenuItem
  } from "entities/components"
import { Settings, Briefcase } from "lucide-react"
import { useSidebarView } from "../model/useSidebarView";
import { useNavigate } from "react-router";

type MenuItem = {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
}

export const AppSidebar = () => {
  const { setView } = useSidebarView();
  const navigate = useNavigate();
  
  const menuItems: MenuItem[] = [
    {
      icon: <Briefcase />,
      label: "My works",
      onClick: () => navigate("/")
    },
    {
      icon: <Settings />,
      label: "Settings",
      onClick: () => setView("settings")
    }
  ];
  
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarHeader />
        <SidebarMenu>
          {menuItems.map((item, index) => (
            <SidebarMenuItem key={index} onClick={item.onClick}>
              {item.icon}
              <span>{item.label}</span>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  )
}
  