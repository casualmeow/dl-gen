import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "entities/components";
import { Separator } from "entities/components";
import { SidebarTrigger } from "entities/components";

export interface BreadcrumbItem {
    label: string;
    href?: string;
}

export interface HeaderProps {
    breadcrumbs: BreadcrumbItem[];
}

export interface SeparatorProps {
    orientation: 'vertical' | 'horizontal';
    className?: string;
}

export function AppHeader({ breadcrumbs }: HeaderProps) {
  return (
    <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
      <div className="flex items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 !h-4 bg-border"/>
        <Breadcrumb>
        <BreadcrumbList>
            {breadcrumbs.map((crumb, index) => (
              <>
                <BreadcrumbItem key={index} className={index === breadcrumbs.length - 1 ? '' : 'hidden md:block'}>
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
    </header>
  );
}