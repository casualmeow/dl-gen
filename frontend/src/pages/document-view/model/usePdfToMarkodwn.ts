// hooks/usePdfToMarkdown.ts
import { useState, useEffect, useCallback } from "react";

export type ConversionStatus =
  | "idle"
  | "loading"
  | "cached"
  | "converted"
  | "notfound"
  | "error";

interface UsePdfToMarkdownResult {
  markdown: string;
  status: ConversionStatus;
  refresh: () => void;
}

export function usePdfToMarkdown(
  fileId: string | undefined,
  pdfBlob: Blob | null
): UsePdfToMarkdownResult {
  const [markdown, setMarkdown] = useState("");
  const [status, setStatus] = useState<ConversionStatus>("idle");

  const fetchMarkdown = useCallback(async () => {
    if (!fileId) {
      setStatus("notfound");
      return;
    }

    setStatus("loading");
    try {
      // 1) GET кеш
      const getRes = await fetch(`/api/v2/markdown?fileId=${fileId}`);
      if (getRes.ok) {
        const { markdown: md, cached } = await getRes.json();
        setMarkdown(md);
        setStatus(cached ? "cached" : "converted");
        return;
      }

      if (getRes.status === 404) {
        // 2) не в кеші → конвертація
        if (!pdfBlob) {
          setStatus("notfound");
          return;
        }
        const form = new FormData();
        form.append("file", pdfBlob, "document.pdf");

        const postRes = await fetch(`/api/v2/markdown?fileId=${fileId}`, {
          method: "POST",
          body: form,
        });
        if (!postRes.ok) {
          setStatus("error");
          return;
        }
        // read plain-text response
        const newMd = await postRes.text();
        setMarkdown(newMd);
        setStatus("converted");
        return;
      }

      setStatus("error");
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  }, [fileId, pdfBlob]);

  useEffect(() => {
    if (status === "idle") {
      fetchMarkdown();
    }
  }, [status, fetchMarkdown]);

  const refresh = useCallback(() => {
    setStatus("idle");
  }, []);

  return { markdown, status, refresh };
}
