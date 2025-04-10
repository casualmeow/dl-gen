"use client"

import type React from "react"

import { useState, useRef, useCallback, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "entities/components"
import { Card } from "entities/components"
import { Progress } from "entities/components"
import { Badge } from "entities/components"
import { Button } from "entities/components"
import { Upload, CheckCircle, AlertCircle } from "lucide-react"
import { cn } from "shared/lib/utils"
import { useToast } from "../../model/useToast"
import { useUploadModal } from "./context"
import { FileItem } from "./item"

export function UploadModal() {
  const { toast } = useToast()
  const { open, openDropzone } = useUploadModal()
  const [isDragging, setIsDragging] = useState(false)
  const [files, setFiles] = useState<File[]>([])
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploaded, setUploaded] = useState(false)
  const [invalidFiles, setInvalidFiles] = useState<string[]>([])

  const fileInputRef = useRef<HTMLInputElement>(null)

  // Accepted file types
  const acceptedFileTypes = [
    "application/pdf", 
    "application/msword", // DOC
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // DOCX
  ]

  const acceptedExtensions = [".pdf", ".doc", ".docx"]

  const validateFiles = (filesToValidate: File[]) => {
    const valid: File[] = []
    const invalid: string[] = []

    filesToValidate.forEach((file) => {
      if (acceptedFileTypes.includes(file.type)) {
        valid.push(file)
      } else {
        invalid.push(file.name)
      }
    })

    if (invalid.length > 0) {
      setInvalidFiles(invalid)
      toast({
        title: "Invalid file type",
        description: `Only PDF and Word documents are accepted.`,
        variant: "destructive",
      })
    }

    return valid
  }

  const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }, [])

  const handleDragOver = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      e.stopPropagation()
      if (!isDragging) {
        setIsDragging(true)
      }
    },
    [isDragging],
  )

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    setInvalidFiles([])

    const droppedFiles = Array.from(e.dataTransfer.files)
    const validFiles = validateFiles(droppedFiles)

    if (validFiles.length > 0) {
      setFiles(validFiles)
      setUploaded(false)
    }
  }, [])

  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setInvalidFiles([])
    if (e.target.files && e.target.files.length > 0) {
      const selectedFiles = Array.from(e.target.files)
      const validFiles = validateFiles(selectedFiles)

      if (validFiles.length > 0) {
        setFiles(validFiles)
        setUploaded(false)
      }
    }
  }, [])

  const openFileDialog = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index))
  }

  // Auto-upload when files are selected
  useEffect(() => {
    if (files.length > 0 && !uploading && !uploaded) {
      handleUpload()
    }
  }, [files])

  const handleUpload = () => {
    if (files.length === 0 || uploading || uploaded) return

    setUploading(true)
    setUploadProgress(0)

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        const newProgress = prev + Math.random() * 10
        if (newProgress >= 100) {
          clearInterval(interval)
          return 100
        }
        return newProgress
      })
    }, 300)

    // Simulate upload completion
    setTimeout(() => {
      clearInterval(interval)
      setUploadProgress(100)
      setUploading(false)
      setUploaded(true)

      // Log the uploaded files (in a real app, you'd send these to your server)
      console.log(
        "Files uploaded:",
        files.map((f) => f.name),
      )

      toast({
        title: "Upload complete",
        description: `Successfully uploaded ${files.length} ${files.length === 1 ? "file" : "files"}`,
      })

      // Close the modal after a short delay
      setTimeout(() => {
        openDropzone(false)
        // Reset state after modal is closed
        setTimeout(() => {
          setFiles([])
          setUploaded(false)
          setUploadProgress(0)
        }, 300)
      }, 1500)
    }, 3000)
  }

  // Reset state when modal closes
  useEffect(() => {
    if (!open) {
      setTimeout(() => {
        if (!open) {
          setFiles([])
          setUploaded(false)
          setUploadProgress(0)
          setInvalidFiles([])
          setIsDragging(false)
        }
      }, 300)
    }
  }, [open])

  return (
    <Dialog open={open} onOpenChange={openDropzone}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Upload documents</DialogTitle>
          <DialogDescription>Drag and drop your PDF or Word documents, or click to browse</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <input
            ref={fileInputRef}
            type="file"
            multiple
            onChange={handleFileInputChange}
            className="hidden"
            accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          />

          {!uploading && !uploaded ? (
            <Card
              onClick={openFileDialog}
              onDragEnter={handleDragEnter}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={cn(
                "border-2 border-dashed p-10 transition-all duration-300 text-center cursor-pointer relative overflow-hidden",
                isDragging ? "border-primary bg-primary/5" : "hover:border-primary/50 hover:bg-muted/50",
              )}
            >
              <div className="flex flex-col items-center justify-center space-y-4 relative z-10">
                <div
                  className={cn(
                    "w-20 h-20 rounded-full flex items-center justify-center transition-all duration-500 bg-muted",
                    isDragging && "scale-110 bg-primary/10",
                  )}
                >
                  <Upload
                    className={cn(
                      "h-10 w-10 text-muted-foreground transition-all duration-300",
                      isDragging && "text-primary animate-bounce",
                    )}
                  />
                </div>
                <div className="space-y-2">
                  <p className="text-lg font-medium">
                    {isDragging ? "Drop documents here" : "Drag documents here or click to browse"}
                  </p>
                  <p className="text-sm text-muted-foreground">Only PDF and Word documents are accepted</p>
                  <div className="flex justify-center gap-2 pt-2">
                    {acceptedExtensions.map((ext) => (
                      <Badge key={ext} variant="outline">
                        {ext}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
              {isDragging && <div className="absolute inset-0 bg-primary/5 animate-pulse" />}
            </Card>
          ) : (
            <Card className="p-10">
              <div className="flex flex-col items-center justify-center space-y-6">
                {uploading ? (
                  <>
                    <div className="relative w-20 h-20 flex items-center justify-center">
                      <div className="absolute inset-0 rounded-full border-4 border-muted animate-spin" />
                      <div className="text-xl font-bold">{Math.round(uploadProgress)}%</div>
                    </div>
                    <div className="text-center">
                      <h3 className="text-lg font-medium">Uploading documents...</h3>
                      <p className="text-sm text-muted-foreground">
                        Please wait while your documents are being uploaded
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400">
                      <CheckCircle className="h-10 w-10" />
                    </div>
                    <div className="text-center">
                      <h3 className="text-lg font-medium">Upload complete!</h3>
                      <p className="text-sm text-muted-foreground">
                        Successfully uploaded {files.length} {files.length === 1 ? "document" : "documents"}
                      </p>
                    </div>
                  </>
                )}
              </div>
            </Card>
          )}

          {files.length > 0 && !uploaded && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">Selected documents ({files.length})</p>
                {!uploading && (
                  <Button variant="ghost" size="sm" onClick={() => setFiles([])} className="h-8 text-xs">
                    Clear all
                  </Button>
                )}
              </div>
              <div className="max-h-48 overflow-y-auto space-y-2 pr-2">
                {files.map((file, index) => (
                  <FileItem key={index} file={file} onRemove={() => removeFile(index)} disabled={uploading} />
                ))}
              </div>
            </div>
          )}

          {invalidFiles.length > 0 && (
            <Card className="bg-destructive/10 border-destructive/20 p-3">
              <div className="flex gap-2">
                <AlertCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-destructive">Invalid file type</p>
                  <p className="text-xs text-muted-foreground">
                    The following files are not accepted: {invalidFiles.join(", ")}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Only PDF and Word documents (.pdf, .doc, .docx) are allowed.
                  </p>
                </div>
              </div>
            </Card>
          )}

          {uploading && (
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Uploading...</span>
                <span>{Math.round(uploadProgress)}%</span>
              </div>
              <Progress value={uploadProgress} className="h-2" />
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
