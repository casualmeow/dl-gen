// entities/works/FileUploaderWithModal.tsx
'use client';

import { useState } from 'react';
import { FileUploaderComponent } from './empty';
import { UploadModal } from 'shared/ui/upload';
import { uploadFile } from 'features/uploadFile';
import { useNavigate } from 'react-router';
import { useUploadModal } from 'shared/ui/upload';

export function FileUploaderWithModal() {
  const navigate = useNavigate();
  const { openDropzone } = useUploadModal();

  // Тут зберігатимуться файли, які віддасть FileUploaderComponent
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  // Коли в FileUploaderComponent вибрали(скинули) файли – цей колбек спрацює
  const handleFilesSelected = (files: File[]) => {
    setSelectedFiles(files);
    openDropzone(true);
  };

  // Після того, як UploadModal «симулював» аплоуд, викликається цей колбек:
  const handleUploadComplete = async (files: File[]) => {
    const firstFile = files[0];
    if (!firstFile) return;

    try {
      const redirectPath = await uploadFile(firstFile);
      navigate(redirectPath);
    } catch (error) {
      console.error('Помилка реального завантаження:', error);
      // Тут можна показати toast-сповіщення про помилку
    }
  };

  return (
    <>
      {/* 1) Сам FileUploaderComponent (квадрат із іконкою, drag’n’drop) */}
      <FileUploaderComponent
        accept="application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        multiple={false}
        onFilesSelected={handleFilesSelected}
        className="w-full max-w-xs mx-auto" // приклад стилів
      />

      {/* 2) UploadModal, отримує selectedFiles у проп initialFiles */}
      <UploadModal
        initialFiles={selectedFiles}
        onUploadComplete={handleUploadComplete}
      />
    </>
  );
}
