import { Bold, Italic, Underline, NotebookText, Download } from 'lucide-react';
import { Toggle } from 'entities/components';
import { Button } from 'entities/components';

type Props = {
  onStyle: (style: 'bold' | 'italic' | 'underline') => void;
  onToggleInspector: () => void;
};

export const PdfEditorToolbar = ({ onStyle, onToggleInspector }: Props) => {

  return (
    <div className="w-full p-2 border-b shadow flex justify-between items-center gap-2">
      <div>
        <Toggle onClick={() => onStyle('bold')}>
          <Bold className="w-4 h-4" />
        </Toggle>
        <Toggle onClick={() => onStyle('italic')}>
          <Italic className="w-4 h-4" />
        </Toggle>
        <Toggle onClick={() => onStyle('underline')}>
          <Underline className="w-4 h-4" />
        </Toggle>
      </div>
      <div>
        <Button variant="ghost" onClick={onToggleInspector}> 
          <NotebookText />
          Tree inspector
        </Button>
        <Button variant="ghost">
          <Download />
        </Button>
      </div>
    </div>
  );
};
