import { ModeToggle } from "shared/ui/toggleTheme";
import { SidebarGroup, SidebarMenuItem } from "entities/components";
import { BackButton } from "./backButton";

type SidebarSettingsProps = {
    showBack: boolean;
    onBack: () => void;
  };

export const SidebarSettings = ({ showBack, onBack }: SidebarSettingsProps) => {
    return (
        <>
            {showBack && <BackButton onClick={onBack} />}<span>Back</span>
            <SidebarGroup>
                <SidebarMenuItem>
                    <ModeToggle />
                </SidebarMenuItem>
                <SidebarMenuItem>
                    <span>Theme</span>
                </SidebarMenuItem>
            </SidebarGroup>
        </>
    )
}