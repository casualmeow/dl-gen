import { AppSidebar, AppSidebarProvider } from "widgets/sidebar";
import { AppHeader } from "widgets/header";
import { ArrowRight } from "lucide-react";
import { useParams } from "react-router";
import { useEffect, useState } from "react";
import { PdfViewer } from "features/pdfViewer";
import { MarkdownDialog } from "./markdown-dialog"

export function ViewPage(){
    const { fileId } = useParams();
    const [pdfUrl, setPdfUrl] = useState('');
     const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`/api/files/${fileId}`);
        if (!res.ok) throw new Error();
        const blob = await res.blob();
        setPdfBlob(blob);
        setPdfUrl(URL.createObjectURL(blob));
      } catch {
        console.error("PDF retrieval failed");
      }
    })();
  }, [fileId]);
    
    return (
        <AppSidebarProvider>
            <AppSidebar />
              <div className="grid grid-rows-[auto_1fr] h-screen w-full">
                   {pdfUrl && (
                      <MarkdownDialog
                        isOpen={isDialogOpen}
                        onOpenChange={setIsDialogOpen}
                        pdfBlob={pdfBlob!}
                      />
                    )}
              <AppHeader breadcrumbs={[
              { label: 'Your works', href: '/' },
              { label: 'View' }]} 
              actionButton={{
                label: 'Next',
                icon: <ArrowRight className="w-4 h-4" />,
                onClick: () => {setIsDialogOpen(true);},
              }}/>
              <PdfViewer pdfUrl={pdfUrl} />
              </div>
        </AppSidebarProvider>
    )
}