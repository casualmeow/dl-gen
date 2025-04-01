import { ModeToggle } from 'shared/ui/toggleTheme';
import { SidebarGroup, SidebarMenuItem } from 'entities/components';
import { BackButton } from './backButton';

type SidebarSettingsProps = {
  showBack: boolean;
  onBack: () => void;
};

export const SidebarSettings = ({ showBack, onBack }: SidebarSettingsProps) => {
  return (
    <div className='p-2'>
      {showBack && <BackButton onClick={onBack} />}
      <SidebarGroup>
        <SidebarMenuItem>
          <ModeToggle />
        </SidebarMenuItem>
      </SidebarGroup>
    </div>
  );
};
