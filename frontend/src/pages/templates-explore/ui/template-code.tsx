"use client"

import type React from "react"

import { useState } from "react"
import { Copy } from "lucide-react"

import { Button } from "entities/components"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "entities/components"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "entities/components"

interface CodePreviewDialogProps {
  code: string
  title: string
  children: React.ReactNode
}

export function CodePreviewDialog({ code, title, children }: CodePreviewDialogProps) {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>Nunjucks (.njk) template code</DialogDescription>
        </DialogHeader>
        <Tabs defaultValue="code" className="w-full">
          <div className="flex justify-between items-center mb-4">
            <TabsList>
              <TabsTrigger value="code">Code</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
            </TabsList>
            <Button variant="outline" size="sm" className="gap-2" onClick={copyToClipboard}>
              <Copy className="h-4 w-4" />
              {copied ? "Copied!" : "Copy Code"}
            </Button>
          </div>
          <TabsContent value="code" className="mt-0">
            <div className="relative rounded-md bg-muted p-4 overflow-auto max-h-[60vh]">
              <pre className="text-sm font-mono">{code}</pre>
            </div>
          </TabsContent>
          <TabsContent value="preview" className="mt-0">
            <div className="border rounded-md p-4 overflow-auto max-h-[60vh]">
              <div dangerouslySetInnerHTML={{ __html: code.replace(/{{.*?}}/g, "Example").replace(/{%.*?%}/g, "") }} />
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
