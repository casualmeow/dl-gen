import { UpperHeader } from './upperHeader';
import { Button } from 'entities/components';
import { Avatar, AvatarFallback } from 'entities/components';
import { User, LogIn } from 'lucide-react';

export function UnauthorizedUserHeader() {

  return (
    <div className="flex flex-col items-center justify-between w-full">
      <UpperHeader />
      <div className="px-3 py-2 w-full">
      <div className="rounded-lg border border-border/40 bg-card p-3 shadow-sm">
        <div className="mb-3 flex items-center justify-center">
          <Avatar className="h-12 w-12 ring-2 ring-background">
            <AvatarFallback className="bg-primary/10">
              <User className="h-6 w-6 text-primary" />
            </AvatarFallback>
          </Avatar>
        </div>
        <div className="mb-3 text-center">
          <h3 className="text-sm font-medium">Welcome to PDF to Site</h3>
          <p className="text-xs text-muted-foreground">Sign in to access your workspace</p>
        </div>
        <Button variant="default" size="sm" className="w-full gap-2" asChild>
          <a href="/login">
            <LogIn className="h-4 w-4" />
            sign in
          </a>
        </Button>
      </div>
    </div>
    </div>
  );
}
