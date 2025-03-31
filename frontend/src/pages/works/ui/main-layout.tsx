import { FileUploaderComponent } from 'entities/works';
import { uploadFile } from 'features/uploadFile';

export function MainPageLayout() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="w-full max-w-5xl">
        <h1 className="text-2xl font-bold mb-6">File Uploader Example</h1>
        <div className="flex flex-wrap gap-4">
          <FileUploaderComponent
            onFilesSelected={(files) => {
              uploadFile(files[0]);
            }}
            accept="application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            multiple={false}
          />
        </div>
      </div>
    </main>
  );
}
