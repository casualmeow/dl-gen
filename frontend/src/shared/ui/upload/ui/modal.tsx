'use client';

import type React from 'react';
import { useState, useRef, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from 'entities/components';
import { Card } from 'entities/components';
import { Progress } from 'entities/components';
import { Badge } from 'entities/components';
import { Button } from 'entities/components';
import { Upload, CheckCircle, AlertCircle } from 'lucide-react';
import { cn } from 'shared/lib/utils';
import { useToast } from '../model/useToast';
import { useUploadModal } from '../api/provider';
import { FileItem } from './item';
import { useTranslation } from 'react-i18next';

interface UploadModalProps {
  onUploadComplete?: (files: File[]) => void;
  initialFiles?: File[];
}

export function UploadModal({ onUploadComplete, initialFiles }: UploadModalProps) {
  const { toast } = useToast();
  const { open, openDropzone } = useUploadModal();
  const { t } = useTranslation();

  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploaded, setUploaded] = useState(false);
  const [invalidFiles, setInvalidFiles] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const acceptedFileTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ];
  const acceptedExtensions = ['.pdf', '.doc', '.docx'];

  // Якщо є initialFiles – встановлюємо його у внутрішній state і відкриваємо модалку
  useEffect(() => {
    if (initialFiles && initialFiles.length > 0) {
      const valid = validateFiles(initialFiles);
      if (valid.length > 0) {
        setFiles(valid);
        setUploaded(false);
        openDropzone(true);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialFiles]);

  // Автоматичний старт аплоаду, коли файли встановлені вдруге (іще не завантажувались)
  useEffect(() => {
    if (files.length > 0 && !uploading && !uploaded) {
      handleUpload();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [files]);

  const validateFiles = (filesToValidate: File[]) => {
    const valid: File[] = [];
    const invalid: string[] = [];

    filesToValidate.forEach((file) => {
      if (acceptedFileTypes.includes(file.type)) {
        valid.push(file);
      } else {
        invalid.push(file.name);
      }
    });

    if (invalid.length > 0) {
      setInvalidFiles(invalid);
      toast({
        title: t('uploadModal.invalidFileType'),
        description: t('uploadModal.acceptedFiles'),
        variant: 'destructive',
      });
    }

    return valid;
  };

  const handleUpload = () => {
    if (files.length === 0 || uploading || uploaded) return;

    setUploading(true);
    setUploadProgress(0);

    // Імітація прогресу (ви можете тут підключити реальний onUploadProgress від axios)
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        const next = prev + Math.random() * 10;
        if (next >= 100) {
          clearInterval(interval);
          return 100;
        }
        return next;
      });
    }, 300);

    setTimeout(() => {
      clearInterval(interval);
      setUploadProgress(100);
      setUploading(false);
      setUploaded(true);

      toast({
        title: t('uploadModal.uploadComplete'),
        description: t('uploadModal.successfullyUploaded', { count: files.length }),
      });

      onUploadComplete?.(files);

      setTimeout(() => {
        openDropzone(false);
        setTimeout(() => {
          setFiles([]);
          setUploaded(false);
          setUploadProgress(0);
          setInvalidFiles([]);
          setIsDragging(false);
        }, 300);
      }, 1500);
    }, 3000);
  };

  useEffect(() => {
    if (!open) {
      setTimeout(() => {
        if (!open) {
          setFiles([]);
          setUploaded(false);
          setUploadProgress(0);
          setInvalidFiles([]);
          setIsDragging(false);
        }
      }, 300);
    }
  }, [open]);

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    setInvalidFiles([]);

    const droppedFiles = Array.from(e.dataTransfer.files);
    const valid = validateFiles(droppedFiles);
    if (valid.length > 0) {
      setFiles(valid);
      setUploaded(false);
    }
  };
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selected = Array.from(e.target.files);
      const valid = validateFiles(selected);
      if (valid.length > 0) {
        setFiles(valid);
        setUploaded(false);
      }
    }
  };
  const openFileDialog = () => {
    fileInputRef.current?.click();
  };
  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <Dialog open={open} onOpenChange={openDropzone}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{t('uploadModal.title')}</DialogTitle>
          <DialogDescription>
            {uploading ? t('uploadModal.uploading') : t('uploadModal.description')}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <input
            ref={fileInputRef}
            type="file"
            multiple
            onChange={handleFileInputChange}
            className="hidden"
            accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          />

          {!uploading && !uploaded ? (
            <Card
              onClick={openFileDialog}
              onDragEnter={handleDragEnter}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={cn(
                'border-2 border-dashed p-10 transition-all duration-300 text-center cursor-pointer relative overflow-hidden',
                isDragging
                  ? 'border-primary bg-primary/5'
                  : 'hover:border-primary/50 hover:bg-muted/50',
              )}
            >
              <div className="flex flex-col items-center justify-center space-y-4 relative z-10">
                <div
                  className={cn(
                    'w-20 h-20 rounded-full flex items-center justify-center transition-all duration-500 bg-muted',
                    isDragging && 'scale-110 bg-primary/10',
                  )}
                >
                  <Upload
                    className={cn(
                      'h-10 w-10 text-muted-foreground transition-all duration-300',
                      isDragging && 'text-primary animate-bounce',
                    )}
                  />
                </div>
                <div className="space-y-2">
                  <p className="text-lg font-medium">
                    {isDragging
                      ? t('uploadModal.dropHere')
                      : t('uploadModal.dragOrClick')}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {t('uploadModal.acceptedFiles')}
                  </p>
                  <div className="flex justify-center gap-2 pt-2">
                    {acceptedExtensions.map((ext) => (
                      <Badge key={ext} variant="outline">
                        {ext.toUpperCase()}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
              {isDragging && <div className="absolute inset-0 bg-primary/5 animate-pulse" />}
            </Card>
          ) : (
            <Card className="p-10">
              <div className="flex flex-col items-center justify-center space-y-6">
                {uploading ? (
                  <>
                    <div className="relative w-20 h-20 flex items-center justify-center">
                      <div className="absolute inset-0 rounded-full border-4 border-muted animate-spin" />
                      <div className="text-xl font-bold">{Math.round(uploadProgress)}%</div>
                    </div>
                    <div className="text-center">
                      <h3 className="text-lg font-medium">{t('uploadModal.uploading')}</h3>
                      <p className="text-sm text-muted-foreground">
                        {t('uploadModal.pleaseWait')}
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400">
                      <CheckCircle className="h-10 w-10" />
                    </div>
                    <div className="text-center">
                      <h3 className="text-lg font-medium">{t('uploadModal.uploadComplete')}</h3>
                      <p className="text-sm text-muted-foreground">
                        {t('uploadModal.successfullyUploaded', { count: files.length })}
                      </p>
                    </div>
                  </>
                )}
              </div>
            </Card>
          )}

          {files.length > 0 && !uploaded && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">{t('uploadModal.selectedDocuments', { count: files.length })}</p>
                {!uploading && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setFiles([])}
                    className="h-8 text-xs"
                  >
                    {t('uploadModal.clearAll')}
                  </Button>
                )}
              </div>
              <div className="max-h-48 overflow-y-auto space-y-2 pr-2">
                {files.map((file, index) => (
                  <FileItem
                    key={index}
                    file={file}
                    onRemove={() => removeFile(index)}
                    disabled={uploading}
                  />
                ))}
              </div>
            </div>
          )}

          {invalidFiles.length > 0 && (
            <Card className="bg-destructive/10 border-destructive/20 p-3">
              <div className="flex gap-2">
                <AlertCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-destructive">{t('uploadModal.invalidFileType')}</p>
                  <p className="text-xs text-muted-foreground">
                    {t('uploadModal.notAcceptedFiles', { files: invalidFiles.join(', ') })}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {t('uploadModal.acceptedFiles')}
                  </p>
                </div>
              </div>
            </Card>
          )}

          {uploading && (
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">{t('uploadModal.uploading')}</span>
                <span>{Math.round(uploadProgress)}%</span>
              </div>
              <Progress value={uploadProgress} className="h-2" />
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
