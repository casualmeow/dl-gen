"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

interface UploadContextType {
  open: boolean
  openDropzone: (open: boolean) => void
}

const UploadContext = createContext<UploadContextType | undefined>(undefined)

export function UploadProvider({ children }: { children: ReactNode }) {
  const [open, openDropzone] = useState(false)

  return <UploadContext.Provider value={{ open, openDropzone }}>{children}</UploadContext.Provider>
}

export function useUploadModal() {
  const context = useContext(UploadContext)
  if (context === undefined) {
    throw new Error("useUploadModal must be used within an UploadProvider")
  }
  return context
}
