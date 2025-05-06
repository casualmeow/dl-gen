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
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    useEffect(() => {
      const fetchPdf = async () => {
        try {
          const response = await fetch(`/api/files/${fileId}`);
          if (!response.ok) {
            throw new Error('PDF file retrieval failed');
          }
  
          const blob = await response.blob();
          setPdfUrl(URL.createObjectURL(blob));
        } catch (error) {
          console.error("Error fetching PDF:", error);
        }
      };
  
      fetchPdf();
    }, [fileId]);
  
    
    return (
        <AppSidebarProvider>
            <AppSidebar />
              <div className="grid grid-rows-[auto_1fr] h-screen w-full">
              <MarkdownDialog isOpen={isDialogOpen} onOpenChange={setIsDialogOpen} fileUrl={pdfUrl}/>
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