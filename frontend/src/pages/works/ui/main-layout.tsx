import { FileUploaderComponent } from 'entities/works';
import { uploadFile } from 'features/uploadFile';
import { useNavigate } from 'react-router';

export function MainPageLayout() {
  const navigate = useNavigate();
  return (
    <main className="flex min-h-screen flex-col p-6 ml-auto w-[calc(100%-var(--sidebar-width))]">
      <div className="w-full max-w-5xl">
        <h1 className="text-2xl font-bold mb-4">Your works</h1>
        <div className="flex flex-wrap gap-4">
          <FileUploaderComponent
            onFilesSelected={(files) => {
              uploadFile(files[0])
                .then((path) => {
                  navigate(path);
                })
                .catch((error) => {
                  console.error('File upload error:', error);
                });
            }}
            accept="application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            multiple={false}
          />
        </div>
      </div>
    </main>
  );
}
