import { Button } from "entities/components";
import {
  Dialog,
  DialogDescription,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose
} from "entities/components";
import { useEffect } from "react";


interface MarkdownDialogProps {
isOpen: boolean;
onOpenChange: (open: boolean) => void;
fileUrl: string;
}

export function MarkdownDialog({isOpen, onOpenChange, fileUrl}: MarkdownDialogProps) {
    useEffect(() => {
        const fetchMarkdown = async () => {
          try {
            const response = await fetch(`/api/convert?fileUrl=${encodeURIComponent(fileUrl)}`);
            if (!response.ok) throw new Error("Markdown conversion failed");
            const mdText = await response.text();
            setMarkdown(mdText);
          } catch (error) {
            console.error("Error fetching Markdown:", error);
          }
        };
        fetchMarkdown();
      }, [fileUrl]);
    return(
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>PDF to Markdown</DialogTitle>
                    <DialogDescription>
                    This dialog shows the Markdown version of your PDF document.  
                    You can edit the text, add comments, or fix formatting.  
                    Once you’re done, click “Save changes” to regenerate the HTML output.
                    </DialogDescription>
                </DialogHeader>
                
                <DialogFooter className="flex justify-between">
                    <DialogClose asChild>
                        <Button type="button" variant="secondary">
                        Close
                        </Button>
                    </DialogClose>
                    <Button type="submit">Save changes</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}