'use client';

import { Card } from 'entities/components';
import { Badge } from 'entities/components';
import { Button } from 'entities/components';
import { FileText, FileIcon, X } from 'lucide-react';

interface FileItemProps {
  file: File;
  onRemove: () => void;
  disabled?: boolean;
}

export function FileItem({ file, onRemove, disabled = false }: FileItemProps) {
  const getFileIcon = (file: File) => {
    if (file.type === 'application/pdf') {
      return <FileText className="h-5 w-5 text-red-500" />;
    } else {
      return <FileIcon className="h-5 w-5 text-blue-500" />;
    }
  };

  const getFileTypeLabel = (file: File) => {
    if (file.type === 'application/pdf') {
      return 'PDF';
    } else if (file.type === 'application/msword') {
      return 'DOC';
    } else if (
      file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ) {
      return 'DOCX';
    }
    return 'Document';
  };

  return (
    <Card className="flex items-center justify-between p-3">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 rounded bg-muted flex items-center justify-center">
          {getFileIcon(file)}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">{file.name}</p>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              {getFileTypeLabel(file)}
            </Badge>
            <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(1)} KB</p>
          </div>
        </div>
      </div>
      {!disabled && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-full"
          onClick={onRemove}
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Remove file</span>
        </Button>
      )}
    </Card>
  );
}
