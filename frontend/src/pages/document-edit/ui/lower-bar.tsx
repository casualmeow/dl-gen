import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from 'entities/components';
import { Button } from 'entities/components';
import { Slider } from 'entities/components';
import { Separator } from 'entities/components';
import {
  ZoomIn,
  ZoomOut,
  Eye,
  CheckCircle,
  Clock,
  BookOpen,
  AlignJustify,
  Type,
} from 'lucide-react';
import { cn } from 'shared/lib/utils';

interface LowerBarProps {
  className?: string;
  zoom: number;
  onZoomChange: (value: number) => void;
  page: number;
  totalPages: number;
  wordCount: number;
  isSaved: boolean;
  onPageClick?: () => void;
}

export function LowerBar({
  className,
  zoom,
  onZoomChange,
  page,
  totalPages,
  wordCount,
  isSaved,
  onPageClick,
}: LowerBarProps) {
  const currentTime = new Date().toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div
      className={cn(
        'w-full h-7 border-t border-muted bg-muted/60 px-2 text-xs text-muted-foreground shadow-sm backdrop-blur-sm flex items-center',
        className,
      )}
    >
      <TooltipProvider>
        <div className="flex items-center space-x-3">
          <Tooltip>
            <TooltipTrigger asChild>
              <div
                onClick={onPageClick}
                className="flex items-center px-2 py-0.5 hover:bg-muted rounded cursor-pointer"
              >
                <BookOpen className="h-3 w-3 mr-1.5" />
                <span>
                  Page {page} of {totalPages}
                </span>
              </div>
            </TooltipTrigger>
            <TooltipContent side="top">Go to page</TooltipContent>
          </Tooltip>

          <Separator orientation="vertical" className="h-3.5" />

          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center px-2 py-0.5 hover:bg-muted rounded cursor-pointer">
                <Type className="h-3 w-3 mr-1.5" />
                <span>{wordCount} words</span>
              </div>
            </TooltipTrigger>
            <TooltipContent side="top">Word count</TooltipContent>
          </Tooltip>

          <Separator orientation="vertical" className="h-3.5" />

          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center px-2 py-0.5 hover:bg-muted rounded cursor-pointer">
                <Clock className="h-3 w-3 mr-1.5" />
                <span>{currentTime}</span>
              </div>
            </TooltipTrigger>
            <TooltipContent side="top">Current time</TooltipContent>
          </Tooltip>
        </div>

        <div className="flex-1" />

        <div className="flex items-center space-x-3">
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center px-2 py-0.5">
                <CheckCircle
                  className={cn('h-3 w-3 mr-1', isSaved ? 'text-green-600' : 'text-yellow-500')}
                />
                <span>{isSaved ? 'Saved' : 'Saving...'}</span>
              </div>
            </TooltipTrigger>
            <TooltipContent side="top">
              {isSaved ? 'Document is saved' : 'Saving changes...'}
            </TooltipContent>
          </Tooltip>

          <Separator orientation="vertical" className="h-3.5" />

          <div className="flex items-center space-x-1 px-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-5 w-5 p-0 rounded-sm"
              onClick={() => onZoomChange(Math.max(10, zoom - 10))}
            >
              <ZoomOut className="h-3 w-3" />
            </Button>

            <div className="w-20">
              <Slider
                value={[zoom]}
                min={10}
                max={200}
                step={10}
                onValueChange={(val) => onZoomChange(val[0])}
                className="h-1"
              />
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="h-5 w-5 p-0 rounded-sm"
              onClick={() => onZoomChange(Math.min(200, zoom + 10))}
            >
              <ZoomIn className="h-3 w-3" />
            </Button>

            <Tooltip>
              <TooltipTrigger asChild>
                <span className="min-w-[36px] text-center px-0.5 py-0.5 hover:bg-muted rounded cursor-pointer">
                  {zoom}%
                </span>
              </TooltipTrigger>
              <TooltipContent side="top">Zoom level</TooltipContent>
            </Tooltip>
          </div>

          <Separator orientation="vertical" className="h-3.5" />

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-5 w-5 p-0 rounded-sm">
                <AlignJustify className="h-3 w-3" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top">View options</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-5 w-5 p-0 rounded-sm">
                <Eye className="h-3 w-3" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top">Reading view</TooltipContent>
          </Tooltip>
        </div>
      </TooltipProvider>
    </div>
  );
}
