import { UpperHeader } from './upperHeader';
import { Button } from 'entities/components';
import { Avatar, AvatarFallback } from 'entities/components';
import { LogIn } from 'lucide-react';
import { UnauthUser } from '../lib/unauthuser';
import { useTranslation } from 'react-i18next';

export function UnauthorizedUserHeader() {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col items-center justify-between w-full">
      <UpperHeader />
      <div className="px-3 py-2 w-full">
        <div className="rounded-lg border border-border/40 p-3 shadow-sm bg-secondary">
          <div className="mb-3 flex items-center justify-center">
            <Avatar className="h-12 w-12 ring-2 ring-transparent">
              <AvatarFallback className="bg-primary/10">
                <UnauthUser className="h-9 w-9 text-primary" />
              </AvatarFallback>
            </Avatar>
          </div>
          <div className="mb-3 text-center">
            <h3 className="text-sm font-medium">{t('unauthorized.welcome')}</h3>
            <p className="text-xs text-muted-foreground">{t('unauthorized.signInToAccess')}</p>
          </div>
          <Button variant="default" size="sm" className="w-full gap-2" asChild>
            <a href="/login">
              <LogIn className="h-4 w-4" />
              {t('unauthorized.signIn')}
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}
