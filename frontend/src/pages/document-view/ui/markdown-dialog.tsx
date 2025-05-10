// components/MarkdownDialog.tsx
import { useState, useEffect } from "react";
import { Button } from "entities/components";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "entities/components";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "entities/components";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "entities/components";
// Импорт превью разбираемого Markdown
import MDEditor from '@uiw/react-md-editor';


interface MarkdownDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  pdfBlob: Blob;
}

export function MarkdownDialog({
  isOpen,
  onOpenChange,
  pdfBlob,
}: MarkdownDialogProps) {
  const [markdown, setMarkdown] = useState("");

  useEffect(() => {
    if (!isOpen) return;

    const uploadAndConvert = async () => {
      try {
        const form = new FormData();
        form.append("file", pdfBlob, "document.pdf");

        const res = await fetch("/api/v2/convert-file", {
          method: "POST",
          body: form,
        });
        if (!res.ok) throw new Error("Conversion failed");
        const text = await res.text();
        setMarkdown(text);
      } catch (e) {
        console.error(e);
      }
    };

    uploadAndConvert();
  }, [isOpen, pdfBlob]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl w-full">
        <DialogHeader>
          <DialogTitle>PDF → Markdown</DialogTitle>
          <DialogDescription>
            Редактируйте Markdown и смотрите результат во вкладках.
          </DialogDescription>
        </DialogHeader>

        <Card className="mt-4">
          <CardHeader>
            <CardTitle>Editor</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="edit">
              <TabsList>
                <TabsTrigger value="edit">Edit</TabsTrigger>
                <TabsTrigger value="preview">Preview</TabsTrigger>
              </TabsList>

              <TabsContent value="edit">
                <div className="overflow-hidden rounded-md border">
                  <MDEditor
                    value={markdown}
                    onChange={(v = "") => setMarkdown(v)}
                    height={500}
                  />
                </div>
              </TabsContent>

              <TabsContent value="preview">
                <div className="prose max-h-[500px] overflow-auto p-4 rounded-md">
                  <MDEditor.Markdown source={markdown} />
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <DialogFooter className="mt-4 flex justify-end space-x-2">
          <DialogClose asChild>
            <Button variant="secondary">Закрыть</Button>
          </DialogClose>
          <Button
            onClick={() => {
              /* ...сохранение, если нужно... */
              onOpenChange(false);
            }}
          >
            Сохранить
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}