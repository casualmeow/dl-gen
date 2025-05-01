import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from 'entities/components';
import { Separator } from 'entities/components';
import { SidebarTrigger } from 'entities/components';
import { Button } from 'entities/components';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface HeaderProps {
  breadcrumbs: BreadcrumbItem[];
  actionButton?: {
    label: string;
    icon: React.ReactNode;
    onClick?: () => void;
  }
}

export interface SeparatorProps {
  orientation: 'vertical' | 'horizontal';
  className?: string;
}

export function AppHeader({ breadcrumbs, actionButton }: HeaderProps) {
  return (
    <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
      <div className='flex w-[calc(100%-20px)] justify-between'>
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 !h-4 bg-border" />
          <Breadcrumb>
            <BreadcrumbList>
              {breadcrumbs.map((crumb, index) => (
                <>
                  <BreadcrumbItem
                    key={index}
                    className={index === breadcrumbs.length - 1 ? '' : 'hidden md:block'}
                  >
                    {crumb.href ? (
                      <BreadcrumbLink href={crumb.href}>{crumb.label}</BreadcrumbLink>
                    ) : (
                      <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                    )}
                  </BreadcrumbItem>
                  {index < breadcrumbs.length - 1 && (
                    <BreadcrumbSeparator className="hidden md:block" key={`sep-${index}`} />
                  )}
                </>
              ))}
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      {actionButton && (
        <Button onClick={actionButton.onClick} className="gap-2 text-sm font-semibold">
          {actionButton.label}
          {actionButton.icon}
        </Button>
      )}
      </div>
    </header>
  );
}
