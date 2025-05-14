import React, { useState, useEffect, useRef } from 'react';
import MDEditor from '@uiw/react-md-editor';
// import Markdown from "@uiw/react-md-editor"
import { getCodeString } from 'rehype-rewrite';
import katex from 'katex';
import mermaid from 'mermaid';
import rehypeSanitize from 'rehype-sanitize';
import rehypeKatex from 'rehype-katex';
import rehypeMermaid from 'rehype-mermaidjs';
import 'katex/dist/katex.min.css';
import '@uiw/react-md-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';
import remarkMath from 'remark-math'

import { 
  Button, Card, Dialog, DialogContent, DialogHeader, 
  DialogFooter, DialogTitle, DialogDescription, DialogClose 
} from 'entities/components';
import { Tabs, TabsList, TabsTrigger, TabsContent } from 'entities/components';
import { Loader } from 'entities/components';
import { Loader2, RefreshCw } from 'lucide-react';
import { usePdfToMarkdown } from '../model/usePdfToMarkdown';
import { cn } from 'shared/lib/utils';

export interface PreviewCodeProps {
  inline?: boolean;
  className?: string;
  children?: React.ReactNode;
  node?: any;
  _getCodeString?: (children: any[]) => string;
}

export const PreviewCode: React.FC<PreviewCodeProps> = ({
  inline,
  className = '',
  children,
  node,
  _getCodeString,
}) => {
  const text = Array.isArray(children) ? children.join('') : String(children || '');
  const gcs = _getCodeString ?? getCodeString;
  const codeStr = node?.children ? gcs(node.children) : text;

  // **1) Inline math**
  if (inline && /^\$(.+)\$$/.test(text)) {
    const expr = text.replace(/^\$(.+)\$$/, '$1');
    const html = katex.renderToString(expr, { throwOnError: false });
    return <code dangerouslySetInnerHTML={{ __html: html }} />;
  }

  // **2) Block KaTeX**
  if (/^language-katex/.test(className.toLowerCase())) {
    const html = katex.renderToString(codeStr, { throwOnError: false });
    return <code dangerouslySetInnerHTML={{ __html: html }} />;
  }

  // **3) Mermaid – now with state + effect**
  const [svg, setSvg] = useState<string>('');
  useEffect(() => {
    if (/^language-mermaid/.test(className.toLowerCase())) {
      mermaid
        .render(`mmd-${Math.random()}`, codeStr)
        .then((res) => {
          setSvg(res.svg);
        })
        .catch(() => {
          setSvg('<pre>Invalid diagram</pre>');
        });
    }
  }, [className, codeStr]);

  if (/^language-mermaid/.test(className.toLowerCase())) {
    return (
      <div data-testid="mermaid-container" dangerouslySetInnerHTML={{ __html: svg }} />
    );
  }

  // **4) Fallback**
  return <code className={className}>{children}</code>;
};


interface MarkdownDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  fileId: string;
  pdfBlob: Blob;
}

export function MarkdownDialog({
  isOpen,
  onOpenChange,
  fileId,
  pdfBlob,
}: MarkdownDialogProps) {
  const { markdown, status, refresh, save } = usePdfToMarkdown(
    fileId,
    pdfBlob
  );
  const [edited, setEdited] = useState(markdown);
  const prevOpen = useRef(isOpen);
  const initial = useRef(markdown);

  useEffect(() => {
    setEdited(markdown);
    initial.current = markdown;
  }, [markdown]);

  useEffect(() => {
    if (prevOpen.current && !isOpen && initial.current !== edited) {
      save(edited);
    }
    prevOpen.current = isOpen;
  }, [isOpen, edited, save]);

  const isLoading = status === 'loading';
  const isError = status === 'error' || status === 'notfound';

  const toolbar = [
    // default commands plus your refresh button
    'bold',
    'italic',
    'strike',
    'code',
    'link',
    {
      name: 'refresh',
      keyCommand: 'refresh',
      buttonProps: { 'aria-label': 'Refresh' },
      icon: <RefreshCw />,      // ← no nested <button>
      execute: () => refresh(),
    },
    'divider',
    'fullscreen',
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl w-full">
        <DialogHeader>
          <DialogTitle>PDF → Markdown</DialogTitle>
          <DialogDescription>
            {isLoading && 'Converting…'}
            {isError && 'Conversion failed or file not found.'}
            {!isLoading && !isError &&
              'This PDF has been converted to Markdown. Edit below and Save.'}
          </DialogDescription>
        </DialogHeader>

        <Card className="relative bg-background text-foreground">
          {isLoading && (
            <div
              className={cn(
                'absolute inset-0 z-10 flex items-center justify-center',
                'bg-background'
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
              </TabsList>

              <TabsContent value="edit">
                <div className="overflow-hidden rounded-md border">
  <MDEditor
    className="wmde-markdown-var"
    value={edited}
    onChange={(v) => setEdited(v || '')}
    height={500}
    commands={toolbar as any}
    extraCommands={[]}
    preview="live"
    previewOptions={{
      remarkPlugins: [remarkMath],
      rehypePlugins: [
        [rehypeKatex, { strict: false }],
        [rehypeMermaid, {}],
        rehypeSanitize,
      ],
      components: { code: PreviewCode },
    }}
  />
                </div>
              </TabsContent>

              <TabsContent value="preview">
                <div className="prose max-h-[500px] overflow-auto p-4 rounded-md">
   <MDEditor.Markdown
                    source={edited}
                    remarkPlugins={[remarkMath]}
                    rehypePlugins={[
                      [rehypeKatex, { strict: false }],
                      [rehypeMermaid, {}],
                    ]}
                    components={{ code: PreviewCode }}
                  />
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </Card>

        <DialogFooter className="mt-4 flex justify-end space-x-2">
          <DialogClose asChild>
            <Button variant="secondary">Close</Button>
          </DialogClose>
          <Button
            onClick={() => save(edited)}
            disabled={isLoading || isError}
          >
            {isLoading ? <Loader2 className="animate-spin" /> : 'Save'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
