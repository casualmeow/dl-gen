import { Ellipsis } from 'lucide-react';
import { useSidebarView } from '../model/useSidebarView';
import { redirect, useNavigate } from'react-router';
import { LogIn, Palette, Languages, Settings } from 'lucide-react';
import { DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  SidebarHeader,
  SidebarMenuItem,
 } from 'entities/components';
import { Button } from 'entities/components';

export function UnauthorizedUserHeader() {
    const navigate = useNavigate();
    const { setView } = useSidebarView();

    return (
        <div className='flex items-center justify-between w-full'>
            <Button variant='outline' onClick={() => navigate('/login')}>Log in</Button>
            <Button variant='ghost' size='icon' className='h-8 w-8' onClick={() => setView("settings")}>
                <Settings className='h-4 w-4'/>
            </Button>
            {/* <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant='ghost' size='icon' className='h-8 w-8'>
                        <Ellipsis className='h-4 w-4'/>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg mt-1.5 ml-2" side='right' sideOffset={4}>
                    <DropdownMenuLabel>Options</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                        <DropdownMenuItem onClick={() => navigate('/login')}>
                            <LogIn className="mr-2 h-4 w-4" />
                            Log in
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setView("settings")}>
                            <Palette className="mr-2 h-4 w-4" />
                            Theme
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <Languages className="mr-2 h-4 w-4" />
                            Language
                        </DropdownMenuItem>
                    </DropdownMenuGroup>
                </DropdownMenuContent>
            </DropdownMenu> */}
        </div>
    )
}