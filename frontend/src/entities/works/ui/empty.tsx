'use client';

import { useState, useRef, type ChangeEvent, type DragEvent } from 'react';
import { Plus, Upload } from 'lucide-react';
import { cn } from 'shared/lib/utils';

interface FileUploaderProps {
  onFilesSelected?: (files: File[]) => void;
  accept?: string;
  multiple?: boolean;
  maxSize?: number; // in bytes
  className?: string;
}

export function FileUploaderComponent({
  onFilesSelected,
  accept = '*',
  multiple = false,
  maxSize = 10485760, // 10MB default
  className,
}: FileUploaderProps) {
  const [isHovering, setIsHovering] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = (fileList: FileList) => {
    const files = Array.from(fileList);

    // Filter files by size if maxSize is provided
    const validFiles = files.filter((file) => file.size <= maxSize);

    if (validFiles.length > 0) {
      onFilesSelected?.(validFiles);
    }

    // Reset the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div
      className={cn(
        'relative w-1/4 aspect-square border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer transition-all duration-200',
        isDragging || isHovering
          ? 'border-primary bg-primary/5'
          : 'border-muted-foreground/25 hover:border-primary/50',
        className,
      )}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onClick={handleClick}
    >
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept={accept}
        multiple={multiple}
        onChange={handleFileInputChange}
      />

      {isHovering || isDragging ? (
        <>
          <Upload className="h-8 w-8 text-primary mb-2" />
          <p className="text-sm text-center text-muted-foreground">
            Drop files here or click to upload
          </p>
        </>
      ) : (
        <Plus className="h-8 w-8 text-muted-foreground" />
      )}
    </div>
  );
}
