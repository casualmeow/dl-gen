import { cn } from 'shared/lib/utils';
import { Button } from 'entities/components';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from 'entities/components';
import { Input } from 'entities/components';
import { Label } from 'entities/components';
import { useAuth } from 'features/auth';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export function LoginForm({ className, ...props }: React.ComponentPropsWithoutRef<'div'>) {
  const { login, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { t } = useTranslation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(email, password);
  };
  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{t('login.title')}</CardTitle>
          <CardDescription>{t('login.description')}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">{t('login.email')}</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder={t('register.placeholderEmail')}
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">{t('login.password')}</Label>
                  <a
                    href="#"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    {t('login.forgot')}
                  </a>
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? t('login.submitLoading') : t('login.submit')}
              </Button>
              <Button variant="outline" className="w-full">
                {t('login.google')}
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              {t('login.noAccount')}{' '}
              <a href="#" className="underline underline-offset-4">
                {t('login.signup')}
              </a>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
