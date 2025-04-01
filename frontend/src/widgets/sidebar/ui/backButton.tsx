import { ArrowLeft } from 'lucide-react';
import { SidebarMenuItem, SidebarMenuButton } from 'entities/components';

type BackButtonProps = {
  onClick: () => void;
};

export const BackButton = ({ onClick }: BackButtonProps) => {
  return (
    // <button onClick={onClick} className="text-sm">
    //   <ArrowLeft /><span>Back</span>
    // </button>
    <SidebarMenuItem key="back">
                        <SidebarMenuButton asChild>
                    <a onClick={onClick} className="flex items-center gap-3">
                      <ArrowLeft size={18} />
                      <span>Back</span>
                    </a>
                  </SidebarMenuButton>
    </SidebarMenuItem>
  );
};
