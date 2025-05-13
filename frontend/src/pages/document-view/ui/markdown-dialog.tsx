import { usePdfToMarkdown } from '../model/usePdfToMarkodwn';
import { Loader, Button } from 'entities/components';
import { Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from 'entities/components';
import { Card } from 'entities/components';
import { Tabs, TabsList, TabsTrigger, TabsContent } from 'entities/components';
import MDEditor from '@uiw/react-md-editor';
import { cn } from 'shared/lib/utils';

interface MarkdownDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  fileId: string;
  pdfBlob: Blob;
}

export function MarkdownDialog({ isOpen, onOpenChange, fileId, pdfBlob }: MarkdownDialogProps) {
  const { markdown, status, refresh, save } = usePdfToMarkdown(fileId, pdfBlob);

  const isLoading = status === 'loading';
  const isError = status === 'error' || status === 'notfound';

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl w-full">
        <DialogHeader>
          <DialogTitle>PDF → Markdown</DialogTitle>
          <DialogDescription>
            {(status === 'cached' || 'converted') &&
              'Before exploring the HTML templates, current file has been converted to Markdown. You can edit it and then it will be applied to final document.'}
            {(status === 'idle' || isLoading) && 'Converting…'}
            {isError && 'The file is not found or conversion failed.'}
          </DialogDescription>
        </DialogHeader>

        <Card className="mt-4 relative">
          {isLoading && (
            <div
              className={cn(
                'absolute inset-0 z-10 flex items-center justify-center',
                'bg-background',
              )}
            >
              <Loader />
            </div>
          )}

          <Tabs defaultValue="edit" asChild>
            <div>
              <TabsList>
                <TabsTrigger value="edit" disabled={isLoading || isError}>
                  Edit
                </TabsTrigger>
                <TabsTrigger value="preview" disabled={isLoading || isError}>
                  Preview
                </TabsTrigger>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={refresh}
                  disabled={isLoading}
                  className="ml-auto"
                >
                  ↻
                </Button>
              </TabsList>

              <TabsContent value="edit">
                <div className="overflow-hidden rounded-md border">
                  <MDEditor value={markdown} height={500} />
                </div>
              </TabsContent>

              <TabsContent value="preview">
                <div className="prose max-h-[500px] overflow-auto p-4 rounded-md">
                  <MDEditor.Markdown source={markdown} />
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </Card>

        <DialogFooter className="mt-4 flex justify-end space-x-2">
          <DialogClose asChild>
            <Button variant="secondary">Закрити</Button>
          </DialogClose>
          <Button onClick={() => onOpenChange(false)} disabled={isLoading}></Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
