import { Bold, Italic, Underline } from 'lucide-react';
import { Toggle } from 'entities/components/ui/toggle';

type Props = {
  onStyle: (style: 'bold' | 'italic' | 'underline') => void;
};

export const PdfEditorToolbar = ({ onStyle }: Props) => {
  return (
    <div className="w-full p-2 border-b shadow flex items-center gap-2">
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
  );
};
