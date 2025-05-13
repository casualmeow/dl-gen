import { useState, useEffect, useCallback } from 'react';

export type ConversionStatus = 'idle' | 'loading' | 'cached' | 'converted' | 'notfound' | 'error';

interface UsePdfToMarkdownResult {
  markdown: string;
  status: ConversionStatus;
  refresh: () => void;
}

export function usePdfToMarkdown(
  fileId: string | undefined,
  pdfBlob: Blob | null,
): UsePdfToMarkdownResult & { save: (editedMd: string) => Promise<void> } {
  const [markdown, setMarkdown] = useState('');
  const [status, setStatus] = useState<ConversionStatus>('idle');

  const fetchMarkdown = useCallback(async () => {
    if (!fileId) {
      setStatus('notfound');
      return;
    }

    setStatus('loading');
    try {
      const getRes = await fetch(`/api/v2/markdown?fileId=${fileId}`);
      if (getRes.ok) {
        const { markdown: md, cached } = await getRes.json();
        setMarkdown(md);
        setStatus(cached ? 'cached' : 'converted');
        return;
      }

      if (getRes.status === 404) {
        if (!pdfBlob) {
          setStatus('notfound');
          return;
        }
        const form = new FormData();
        form.append('file', pdfBlob, 'document.pdf');

        const postRes = await fetch(`/api/v2/markdown?fileId=${fileId}`, {
          method: 'POST',
          body: form,
        });
        if (!postRes.ok) {
          setStatus('error');
          return;
        }
        const newMd = await postRes.text();
        setMarkdown(newMd);
        setStatus('converted');
        return;
      }

      setStatus('error');
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  }, [fileId, pdfBlob]);

  useEffect(() => {
    if (status === 'idle') {
      fetchMarkdown();
    }
  }, [status, fetchMarkdown]);

  const refresh = useCallback(() => {
    setStatus('idle');
  }, []);

  const save = useCallback(
    async (editedMd: string) => {
      if (!fileId) {
        setStatus('notfound');
        return;
      }
      setStatus('loading');
      try {
        const res = await fetch(`/api/v2/markdown?fileId=${fileId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'text/plain' },
          body: editedMd,
        });
        if (!res.ok) {
          throw new Error(`Save failed: ${res.status}`);
        }
        setMarkdown(editedMd);
        setStatus('cached');
      } catch (err) {
        console.error(err);
        setStatus('error');
      }
    },
    [fileId],
  );

  return { markdown, status, refresh, save };
}
