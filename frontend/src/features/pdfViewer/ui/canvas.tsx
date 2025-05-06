import React, { useEffect, useRef, useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import { initPdfWorker } from 'entities/file';
import { Dock, DockItem } from 'widgets/dock';
import { ChevronLeft, ChevronRight, Hand, Search, ZoomIn, ZoomOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from 'shared/lib/utils';

initPdfWorker();

interface PdfViewerProps {
  pdfUrl: string;
}

type Tool = 'none' | 'pan' | 'magnifier' | 'search';

export const PdfViewer: React.FC<PdfViewerProps> = ({ pdfUrl }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
  
    const [pageNum, setPageNum] = useState(1);
    const [numPages, setNumPages] = useState(0);
    const [scale, setScale] = useState(1.5);
    const [activeTool, setActiveTool] = useState<Tool>('none');
  
    const [isPanning, setIsPanning] = useState(false);
    const panStart = useRef({ x: 0, y: 0 });
    const scrollStart = useRef({ x: 0, y: 0 });
  
    useEffect(() => {
      const renderPdf = async () => {
        const pdf = await pdfjsLib.getDocument(pdfUrl).promise;
        setNumPages(pdf.numPages);
  
        const page = await pdf.getPage(pageNum);
        const viewport = page.getViewport({ scale });
  
        const canvas = canvasRef.current!;
        const context = canvas.getContext('2d')!;
        canvas.height = viewport.height;
        canvas.width = viewport.width;
  
        await page.render({ canvasContext: context, viewport }).promise;
      };
  
      renderPdf();
    }, [pdfUrl, pageNum, scale]);
  
    // Smooth Zoom transitions
    const smoothZoom = (targetScale: number) => {
      setScale(targetScale);
    };
  
    const startPan = (e: React.MouseEvent) => {
      if (activeTool !== 'pan') return;
      setIsPanning(true);
      panStart.current = { x: e.clientX, y: e.clientY };
      scrollStart.current = {
        x: containerRef.current!.scrollLeft,
        y: containerRef.current!.scrollTop,
      };
    };
  
    const pan = (e: React.MouseEvent) => {
      if (!isPanning) return;
      const dx = panStart.current.x - e.clientX;
      const dy = panStart.current.y - e.clientY;
      containerRef.current!.scrollLeft = scrollStart.current.x + dx;
      containerRef.current!.scrollTop = scrollStart.current.y + dy;
    };
  
    const endPan = () => setIsPanning(false);
  
    const handleMagnify = (e: React.MouseEvent) => {
      if (activeTool !== 'magnifier') return;
      const rect = canvasRef.current!.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
  
      smoothZoom(scale + 0.5);
  
      setTimeout(() => {
        containerRef.current!.scrollTo({
          left: (x * (scale + 0.5)) / scale - containerRef.current!.clientWidth / 2,
          top: (y * (scale + 0.5)) / scale - containerRef.current!.clientHeight / 2,
          behavior: 'smooth',
        });
      }, 200);
    };
  
    return (
      <div className="relative flex flex-col items-center overflow-hidden h-screen">
        <div
          ref={containerRef}
          className="overflow-auto cursor-default w-full h-full"
          onMouseDown={startPan}
          onMouseMove={pan}
          onMouseUp={endPan}
          onMouseLeave={endPan}
          onClick={handleMagnify}
        >
          <AnimatePresence>
            <motion.canvas
              key={`${pageNum}-${scale}`}
              ref={canvasRef}
              className={cn("shadow-lg border rounded-md bg-background m-auto my-4")}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            />
          </AnimatePresence>
        </div>
  
        <Dock position="bottom" size="md">
          <DockItem
            icon={<ChevronLeft />}
            label="Previous Page"
            onClick={() => setPageNum((p) => Math.max(p - 1, 1))}
          />
          <DockItem
            icon={<ChevronRight />}
            label="Next Page"
            onClick={() => setPageNum((p) => Math.min(p + 1, numPages))}
          />
          <DockItem
            icon={<ZoomOut />}
            label="Zoom Out"
            onClick={() => smoothZoom(Math.max(scale - 0.2, 0.5))}
          />
          <DockItem
            icon={<ZoomIn />}
            label="Zoom In"
            onClick={() => smoothZoom(scale + 0.2)}
          />
          <DockItem
            icon={<Hand />}
            label="Hand Tool"
            className={activeTool === 'pan' ? 'bg-muted' : ''}
            onClick={() =>
              setActiveTool((t) => (t === 'pan' ? 'none' : 'pan'))
            }
          />
          <DockItem
            icon={<Search />}
            label="Magnifier"
            className={activeTool === 'magnifier' ? 'bg-muted' : ''}
            onClick={() =>
              setActiveTool((t) => (t === 'magnifier' ? 'none' : 'magnifier'))
            }
          />
        </Dock>
  
        <div className={cn("absolute top-4 right-4 bg-black/50 text-primary px-3 py-1 rounded-md shadow-sm text-sm")}>
          Page {pageNum} / {numPages} • {(scale * 100).toFixed(0)}%
        </div>
      </div>
    );
  };