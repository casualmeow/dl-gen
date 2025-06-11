import { cn } from 'shared/lib/utils';
import { Button } from 'entities/components';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from 'entities/components';
import { Input } from 'entities/components';
import { Label } from 'entities/components';
import { useAuth } from 'features/auth';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export function RegisterForm({ className, ...props }: React.ComponentPropsWithoutRef<'div'>) {
  const { register, isLoading } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const { t } = useTranslation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }
    
    setPasswordError('');
    await register(name, email, password);
  };

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{t('register.title')}</CardTitle>
          <CardDescription>{t('register.description')}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="name">{t('register.name')}</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder={t('register.placeholderName')}
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">{t('register.email')}</Label>
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
                <Label htmlFor="password">{t('register.password')}</Label>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="confirmPassword">{t('register.confirmPassword')}</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                {passwordError && (
                  <p className="text-sm text-red-500">{t('register.passwordError')}</p>
                )}
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? t('register.submitLoading') : t('register.submit')}
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              {t('register.alreadyAccount')}{' '}
              <a href="/login" className="underline underline-offset-4">
                {t('register.login')}
              </a>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}