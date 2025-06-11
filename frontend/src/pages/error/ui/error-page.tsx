import { useLocation } from 'react-router';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export function NotFound() {
  const location = useLocation();
  const { t } = useTranslation();

  useEffect(() => {
    console.error('404 Error: User attempted to access non-existent route:', location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-xl mb-4">{t('errorPage.message')}</p>
        <a href="/" className="underline">
          {t('errorPage.home')}
        </a>
      </div>
    </div>
  );
}
