
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from 'entities/components';
import { Button } from 'entities/components';
import { Card } from 'entities/components';
import { Badge } from 'entities/components';
import { FileIcon, FileText } from 'lucide-react';
import { useNavigate } from 'react-router';

interface ChoiceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  fileId: string | null;
  file?: File; 
}

export function ChoiceDialog({
  open,
  onOpenChange,
  fileId,
  file,
}: ChoiceDialogProps) {
  const navigate = useNavigate();

  const handleEdit = () => {
    onOpenChange(false);
    if (fileId) navigate(`/edit/${fileId}`);
  };

  const handleView = () => {
    onOpenChange(false);
    if (fileId) navigate(`/view/${fileId}`);
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    const kb = bytes / 1024;
    if (kb < 1024) return `${kb.toFixed(1)} KB`;
    return `${(kb / 1024).toFixed(1)} MB`;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className=" sm:max-w-full lg:w-fit md:w-full xl:w-fit overflow-hidden">
        <div className="bg-background rounded-lg">
          {/* Заголовок */}
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              Download completed
            </DialogTitle>
            <DialogDescription>
             Your document has been successfully uploaded. What would you like to do next?
            </DialogDescription>
          </DialogHeader>

          {/* Карточка з інформацією про файл */}
          {file && (
            <Card className="p-5 my-5 flex flex-row items-center space-x-4 rounded-lg">
              <div className="flex-shrink-0 m-0">
                {file.type === 'application/pdf' ? (
                  <FileText className="h-10 w-10 text-primary" />
                ) : (
                  <FileIcon className="h-10 w-10 text-primary" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-primary truncate">
                  {file.name}
                </p>
                <div className="mt-1 flex items-center space-x-2">
                  <Badge variant="outline" className="px-2 py-0.5 text-xs">
                    {file.type === 'application/pdf' ? 'PDF' : 'DOC/DOCX'}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {formatSize(file.size)}
                  </span>
                </div>
              </div>
            </Card>
          )}

          <DialogFooter className='flex sm:justify-between'>
          <Button
                onClick={handleCancel}
                variant="ghost">
                Cancel
              </Button>
              <div className='flex flex-row gap-2'>
              <Button
                onClick={handleEdit}
                variant="secondary"
              >
                Edit (beta)
              </Button>
              <Button
                onClick={handleView}
              >
                View
              </Button>
              </div>
          </DialogFooter>
          </div>
      </DialogContent>
    </Dialog>
  );
}
