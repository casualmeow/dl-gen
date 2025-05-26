'use client';

import type React from 'react';

import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

import { Button } from 'entities/components';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from 'entities/components';
import { Tabs, TabsContent, TabsList, TabsTrigger } from 'entities/components';
import { useToast } from '../model/useToast';

interface TemplatePreviewDialogProps {
  template: {
    id: string;
    title: string;
    description: string;
    updatedAt: string;
    category: string | string[];
    tags?: string[];
    previewHtml: string;
    code: string;
  };
  children: React.ReactNode;
  defaultTab?: 'preview' | 'code';
}

export function TemplatePreviewDialog({
  template,
  children,
  defaultTab = 'preview',
}: TemplatePreviewDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'preview' | 'code'>(defaultTab);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const copyToClipboard = () => {
    navigator.clipboard.writeText(template.code);
    setCopied(true);
    toast({
      title: 'Code copied',
      description: 'Template code copied to clipboard',
      duration: 2000,
    });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh]">
        <DialogHeader className="flex flex-row items-center justify-between">
          <div>
            <DialogTitle>{template.title}</DialogTitle>
            <DialogDescription>
              Nunjucks (.njk) template {activeTab === 'preview' ? 'preview' : 'source code'}
            </DialogDescription>
          </div>
        </DialogHeader>
        <Tabs
          defaultValue={defaultTab}
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as 'preview' | 'code')}
          className="w-full"
        >
          <div className="flex justify-between items-center mb-4">
            <TabsList>
              <TabsTrigger value="preview">Preview</TabsTrigger>
              <TabsTrigger value="code">Source Code</TabsTrigger>
            </TabsList>
            <Button variant="outline" size="sm" className="gap-2" onClick={copyToClipboard}>
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              {copied ? 'Copied!' : 'Copy Code'}
            </Button>
          </div>
          <TabsContent value="preview" className="mt-0">
            <div className="border rounded-lg p-6 bg-background overflow-auto h-[60vh]">
              <iframe
                srcDoc={template.previewHtml}
                title={template.title}
                className="w-full h-full mx-auto max-w-[800px]"
                sandbox="allow-scripts allow-same-origin"
              />
            </div>
          </TabsContent>
          <TabsContent value="code" className="mt-0">
            <div className="relative rounded-md bg-muted p-4 overflow-auto max-h-[60vh]">
              <pre className="text-sm font-mono whitespace-pre-wrap">{template.code}</pre>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
