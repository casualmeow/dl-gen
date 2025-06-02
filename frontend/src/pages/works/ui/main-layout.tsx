import { FileUploaderWithModal } from 'entities/works';

export function MainPageLayout() {
  return (
    <main className="container mx-auto flex flex-col p-6 ml-auto">
      <div className="w-full max-w-5xl">
        <h1 className="text-3xl font-bold mb-4">Your works</h1>
        <p className="text-muted-foreground mb-5">
          Upload your documents to create works. Supported formats: PDF, DOC, DOCX.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <FileUploaderWithModal />
        </div>
      </div>
    </main>
  );
}
