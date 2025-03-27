import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle
  } from "entities/components/ui/drawer";
  
  interface DrawerComponentProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    children: React.ReactNode;
    title?: string;
  }
  
  export const DrawerComponent = ({ open, onOpenChange, children, title }: DrawerComponentProps) => (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        {title && (
          <DrawerHeader>
            <DrawerTitle>{title}</DrawerTitle>
          </DrawerHeader>
        )}
        <div className="p-4">
          {children}
        </div>
      </DrawerContent>
    </Drawer>
  );
  