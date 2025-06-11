import { FileUploaderWithModal } from 'entities/works';
import { useTranslation } from 'react-i18next';

export function MainPageLayout() {
  const { t } = useTranslation();
  return (
    <main className="container mx-auto flex flex-col p-6 ml-auto">
      <div className="w-full max-w-5xl">
        <h1 className="text-3xl font-bold mb-4">{t('works.title')}</h1>
        <p className="text-muted-foreground mb-5">
          {t('works.description')}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <FileUploaderWithModal />
        </div>
      </div>
    </main>
  );
}
