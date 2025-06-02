// src/pages/ViewPage.tsx
import { AppSidebar, AppSidebarProvider } from 'widgets/sidebar';
import { AppHeader } from 'widgets/header';
import { ArrowRight } from 'lucide-react';
import { useParams } from 'react-router';
import { useEffect, useState } from 'react';
import { PdfViewer } from 'features/pdfViewer';
import { MarkdownDialog } from './markdown-dialog';
import { Loader } from 'entities/components';

export function ViewPage() {
  const { fileId } = useParams<{ fileId: string }>();
  const [pdfUrl, setPdfUrl] = useState<string>('');
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    setIsLoading(true);
    (async () => {
      try {
        const res = await fetch(`/api/files/${fileId}`);
        if (!res.ok) throw new Error('Network error');
        const blob = await res.blob();
        setPdfBlob(blob);
        setPdfUrl(URL.createObjectURL(blob));
      } catch (e) {
        console.error('PDF retrieval failed', e);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [fileId]);

  return (
    <AppSidebarProvider>
      <AppSidebar />

      <div className="grid grid-rows-[auto_1fr] h-screen w-full">
        <AppHeader
          breadcrumbs={[{ label: 'Your works', href: '/' }, { label: 'View' }]}
          withBorder={true}
          actionButton={{
            label: 'Next',
            icon: <ArrowRight className="w-4 h-4" />,
            onClick: () => setIsDialogOpen(true),
          }}
        />

        <div className="relative flex-1">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <Loader />
            </div>
          ) : (
            <PdfViewer pdfUrl={pdfUrl} />
          )}
        </div>

        {pdfBlob && (
          <MarkdownDialog
            isOpen={isDialogOpen}
            onOpenChange={setIsDialogOpen}
            fileId={fileId!}
            pdfBlob={pdfBlob}
          />
        )}
      </div>
    </AppSidebarProvider>
  );
}
