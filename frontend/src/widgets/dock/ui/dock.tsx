import * as React from 'react';
import { cn } from 'shared/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from 'entities/components';

interface DockProps extends React.HTMLAttributes<HTMLDivElement> {
  position?: 'bottom' | 'left' | 'right' | 'top';
  variant?: 'default' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children?: React.ReactNode;
}

export function Dock({
  position = 'bottom',
  variant = 'default',
  size = 'md',
  className,
  children,
  ...props
}: DockProps) {
  const isHorizontal = position === 'bottom' || position === 'top';

  return (
    <div
      className={cn(
        'fixed z-50 flex',
        variant === 'default' && 'bg-background/60 border shadow-sm backdrop-blur-sm',
        variant === 'ghost' && 'bg-transparent',
        size === 'sm' && 'p-0.5 rounded-md gap-px',
        size === 'md' && 'p-1 rounded-lg gap-0.5',
        size === 'lg' && 'p-1.5 rounded-xl gap-1',
        position === 'bottom' && 'bottom-3 left-1/2 -translate-x-1/2',
        position === 'top' && 'top-3 left-1/2 -translate-x-1/2',
        position === 'left' && 'left-3 top-1/2 -translate-y-1/2 flex-col',
        position === 'right' && 'right-3 top-1/2 -translate-y-1/2 flex-col',
        isHorizontal ? 'items-center' : 'items-center',
        className,
      )}
      {...props}
    >
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child as React.ReactElement<any>, {
            isHorizontal,
            size,
          });
        }
        return child;
      })}
    </div>
  );
}

interface DockItemProps extends React.HTMLAttributes<HTMLDivElement> {
  icon: React.ReactNode;
  label?: string;
  isHorizontal?: boolean;
  size?: 'sm' | 'md' | 'lg';
  dropdownItems?: {
    label: string;
    onClick?: () => void;
    icon?: React.ReactNode;
  }[];
}

export function DockItem({
  icon,
  label,
  isHorizontal = true,
  size = 'md',
  dropdownItems,
  className,
  ...props
}: DockItemProps) {
  const iconSize = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  }[size];

  const buttonSize = {
    sm: 'p-1.5',
    md: 'p-2',
    lg: 'p-2.5',
  }[size];

  if (dropdownItems && dropdownItems.length > 0) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className={cn(
              'flex items-center justify-center rounded-md hover:bg-muted transition-colors duration-200',
              buttonSize,
              className,
            )}
          >
            <span className={cn('text-foreground/80 hover:text-foreground', iconSize)}>{icon}</span>
            <span className="sr-only">{label}</span>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align={isHorizontal ? 'center' : 'start'}
          side={isHorizontal ? 'top' : 'right'}
        >
          {dropdownItems.map((item, index) => (
            <DropdownMenuItem key={index} onClick={item.onClick}>
              {item.icon && <span className="mr-2">{item.icon}</span>}
              {item.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <div className="relative group" {...props}>
      <button
        className={cn(
          'flex items-center justify-center rounded-md hover:bg-muted transition-colors duration-200',
          buttonSize,
          className,
        )}
      >
        <span className={cn('text-foreground/80 hover:text-foreground', iconSize)}>{icon}</span>
        <span className="sr-only">{label}</span>
      </button>
      {label && (
        <div
          className={cn(
            'absolute opacity-0 group-hover:opacity-100 transition-opacity bg-popover text-popover-foreground px-2 py-1 rounded text-xs font-medium shadow-sm whitespace-nowrap',
            isHorizontal ? 'bottom-full mb-1' : 'left-full ml-1',
          )}
        >
          {label}
        </div>
      )}
    </div>
  );
}
