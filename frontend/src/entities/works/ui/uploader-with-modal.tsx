
import { useState } from 'react';
import { FileUploaderComponent } from './empty';
import { UploadModal } from 'shared/ui/upload';
import { ChoiceDialog } from 'shared/ui/upload';
import { uploadFile } from 'features/uploadFile';
import { useUploadModal } from 'shared/ui/upload';

export function FileUploaderWithModal() {
  const { open: _isUploadOpen, openDropzone } = useUploadModal();

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [fileForChoice, setFileForChoice] = useState<File | null>(null);
  const [fileId, setFileId] = useState<string | null>(null);
  const [isChoiceOpen, setIsChoiceOpen] = useState(false);

  // Коли користувач обирає файл (FileUploaderComponent)
  const handleFilesSelected = (files: File[]) => {
    setSelectedFiles(files);
    openDropzone(true);
  };

  // Після завершення імітації завантаження (UploadModal)
  const handleUploadComplete = async (files: File[]) => {
    const firstFile = files[0];
    if (!firstFile) return;

    try {
      // Викликаємо реальний аплоуд
      const newFileId = await uploadFile(firstFile);
      setFileId(newFileId);
      setFileForChoice(firstFile);

      // Закриваємо UploadModal
      openDropzone(false);

      // Трохи чекаємо, щоб UploadModal анімаційно зник (можна регулювати таймінг)
      setTimeout(() => {
        setIsChoiceOpen(true);
      }, 200);
    } catch (error) {
      console.error('File upload error:', error);
      setFileId(null);
    }
  };

  // const handleChoiceClose = () => {
  //   setIsChoiceOpen(false);
  //   setFileId(null);
  //   setFileForChoice(null);
  //   setSelectedFiles([]);
  // };

  return (
    <>
      {/* 1. Користувацький драг-н-дроп / клікабельний аплоудер */}
      <FileUploaderComponent
        accept="application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        multiple={false}
        onFilesSelected={handleFilesSelected}
        className="w-full aspect-square max-w-md mx-auto"
      />

      {/* 2. UploadModal (імітація прогресу) */}
      <UploadModal
        initialFiles={selectedFiles}
        onUploadComplete={handleUploadComplete}
      />

      {/* 3. ChoiceDialog */}
      <ChoiceDialog
        open={isChoiceOpen}
        onOpenChange={setIsChoiceOpen}
        fileId={fileId}
        file={fileForChoice ?? undefined}
      />
    </>
  );
}
