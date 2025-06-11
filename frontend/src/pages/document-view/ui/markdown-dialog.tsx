"use client";

import {
  useState,
  useRef,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import remarkGfm from "remark-gfm";
import rehypeMermaid from "rehype-mermaidjs";
import rehypeSanitize from "rehype-sanitize";
import "katex/dist/katex.min.css";
import { useTranslation } from 'react-i18next';

import {
  Button,
  Card,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
  Textarea,
  Separator,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Loader,
} from "entities/components";
import {
  Loader2,
  RefreshCw,
  Bold,
  Italic,
  Link as IconLink,
  List as IconList,
  ListOrdered as IconListOrdered,
  Quote as IconQuote,
  Code as IconCode,
  Heading1,
  Heading2,
  Heading3,
  Image as ImageIcon,
  Minus,
  EyeOff,
  Eye, Columns, HardDriveDownload
} from "lucide-react";

import { usePdfToMarkdown } from "../model/usePdfToMarkdown";
import { useNavigate } from "react-router";
import { PreviewCode } from "../api/preview-code";

interface MarkdownDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  fileId: string;
  pdfBlob: Blob;
}

interface ToolbarButtonProps {
  icon: ReactNode;
  title: string;
  onClick: () => void;
}

const ToolbarButton = ({ icon, title, onClick }: ToolbarButtonProps) => (
  <Button
    variant="ghost"
    size="sm"
    onClick={onClick}
    title={title}
    className="h-8 w-8 p-0 hover:bg-accent hover:text-accent-foreground"
  >
    {icon}
  </Button>
);

export function MarkdownDialog({
  isOpen,
  onOpenChange,
  fileId,
  pdfBlob,
}: MarkdownDialogProps) {
  const { t } = useTranslation();
  const { markdown, status, refresh, save } = usePdfToMarkdown(fileId, pdfBlob);
  const [value, setValue] = useState(markdown);
  const [activeTab, setActiveTab] = useState("edit");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const initialMarkdown = useRef(markdown);
  const navigate = useNavigate();

  useEffect(() => {
    setValue(markdown);
    initialMarkdown.current = markdown;
  }, [markdown]);

  useEffect(() => {
    if (!isOpen && initialMarkdown.current !== value) {
      save(value);
    }
  }, [isOpen, value, save]);

  const isLoading = status === "loading";
  const isError = status === "error" || status === "notfound";

  const insertText = useCallback(
    (before: string, after = "", placeholder = "") => {
      const textarea = textareaRef.current;
      if (!textarea) return;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selected = value.substring(start, end) || placeholder;
      setValue(
        value.substring(0, start) + before + selected + after + value.substring(end)
      );
      setTimeout(() => textarea.setSelectionRange(start + before.length, start + before.length + selected.length), 0);
    },
    [value]
  );

  const insertAtLineStart = useCallback(
    (prefix: string) => {
      const textarea = textareaRef.current;
      if (!textarea) return;
      const pos = textarea.selectionStart;
      const lineStart = value.lastIndexOf("\n", pos - 1) + 1;
      setValue(value.slice(0, lineStart) + prefix + value.slice(lineStart));
      setTimeout(() => textarea.setSelectionRange(pos + prefix.length, pos + prefix.length), 0);
    },
    [value]
  );

  const downloadMarkdown = () => {
    const blob = new Blob([value], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${fileId}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const toolbarActions = {
    bold: () => insertText("**", "**", "bold text"),
    italic: () => insertText("*", "*", "italic text"),
    heading1: () => insertAtLineStart("# "),
    heading2: () => insertAtLineStart("## "),
    heading3: () => insertAtLineStart("### "),
    link: () => insertText("[", "](url)", "link text"),
    image: () => insertText("![", "](image-url)", "alt text"),
    code: () => insertText("```", "```", "code"),
    quote: () => insertAtLineStart("> "),
    unorderedList: () => insertAtLineStart("- "),
    orderedList: () => insertAtLineStart("1. "),
    hr: () => insertText("\n---\n"),
    refresh,
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-fit sm:min-w-2xl sm:min-h-4/12 sm:max-h-fit">
        <DialogHeader>
          <DialogTitle>{t('markdownDialog.title')}</DialogTitle>
          <DialogDescription>
            {isLoading
              ? t('markdownDialog.converting')
              : isError
              ? t('markdownDialog.failed')
              : t('markdownDialog.converted')}
          </DialogDescription>
        </DialogHeader>

        <Card className="relative bg-background text-foreground">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-background z-20">
              <Loader />
            </div>
          )}

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4 ml-4">
              <TabsTrigger value="edit" disabled={isLoading || isError}>
                <EyeOff className="w-4 h-4" /> {t('markdownDialog.edit')}
              </TabsTrigger>
              <TabsTrigger value="preview" disabled={isLoading || isError}>
                <Eye className="w-4 h-4" /> {t('markdownDialog.preview')}
              </TabsTrigger>
              <TabsTrigger value="split" disabled={isLoading || isError}>
                <Columns className="w-4 h-4 mr-1" /> {t('markdownDialog.split')}
              </TabsTrigger>
            </TabsList>

            {(activeTab === "edit" || activeTab === "split") && (
              <div className="mb-2 flex gap-1 border p-1 rounded-md bg-background">
                <ToolbarButton icon={<Bold />} title="Bold" onClick={toolbarActions.bold} />
                <ToolbarButton icon={<Italic />} title="Italic" onClick={toolbarActions.italic} />
                <Separator orientation="vertical" className="mx-1" />
                <ToolbarButton icon={<Heading1 />} title="H1" onClick={toolbarActions.heading1} />
                <ToolbarButton icon={<Heading2 />} title="H2" onClick={toolbarActions.heading2} />
                <ToolbarButton icon={<Heading3 />} title="H3" onClick={toolbarActions.heading3} />
                <Separator orientation="vertical" className="mx-1" />
                <ToolbarButton icon={<IconLink />} title="Link" onClick={toolbarActions.link} />
                <ToolbarButton icon={<ImageIcon />} title="Image" onClick={toolbarActions.image} />
                <ToolbarButton icon={<IconCode />} title="Code Block" onClick={toolbarActions.code} />
                <Separator orientation="vertical" className="mx-1" />
                <ToolbarButton icon={<IconQuote />} title="Quote" onClick={toolbarActions.quote} />
                <ToolbarButton icon={<IconList />} title="Bullet List" onClick={toolbarActions.unorderedList} />
                <ToolbarButton icon={<IconListOrdered />} title="Ordered List" onClick={toolbarActions.orderedList} />
                <ToolbarButton icon={<Minus />} title="HR" onClick={toolbarActions.hr} />
                <Separator orientation="vertical" className="mx-1" />
                <ToolbarButton icon={<RefreshCw />} title="Refresh" onClick={refresh} />
                <ToolbarButton icon={<HardDriveDownload />} title="Download" onClick={downloadMarkdown} />
              </div>
            )}

            <TabsContent value="edit">
              <Textarea
                ref={textareaRef}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="min-h-[50vh] max-h-[70vh] resize-none p-4 font-mono"
              />
            </TabsContent>

            <TabsContent value="preview">
              <div className="prose p-4 min-h-[50vh] max-h-[70vh] overflow-auto">
                <ReactMarkdown
                  remarkPlugins={[remarkMath, remarkGfm]}
                  rehypePlugins={[rehypeKatex, rehypeMermaid, rehypeSanitize]}
                  components={{ code: PreviewCode }}
                >
                  {value}
                </ReactMarkdown>
              </div>
            </TabsContent>

            <TabsContent value="split">
              <div className="grid grid-cols-2 gap-4">
                <Textarea
                  ref={textareaRef}
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  className="resize-none font-mono p-4 min-h-[50vh] max-h-[60vh]"
                />
                <div className=" p-4 min-h-[50vh] max-h-[60vh] overflow-auto border rounded-md">
                  <ReactMarkdown
                    remarkPlugins={[remarkMath, remarkGfm]}
                    rehypePlugins={[rehypeKatex, rehypeMermaid, rehypeSanitize]}
                    components={{ code: PreviewCode }}
                  >
                    {value}
                  </ReactMarkdown>
                </div>
              </div>
            </TabsContent>
            
          </Tabs>
        </Card>

        <DialogFooter className="flex sm:justify-between">
          <DialogClose asChild><Button variant="ghost">{t('markdownDialog.close')}</Button></DialogClose>
          <div className="flex gap-2">
          <Button disabled={isLoading || isError} variant="secondary" onClick={() => save(value)}>
            {isLoading ? <Loader2 className="animate-spin" /> : t('markdownDialog.save')}
          </Button>
          <Button onClick={() => navigate(`/view/${fileId}/template`)}>{t('markdownDialog.next')}</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
