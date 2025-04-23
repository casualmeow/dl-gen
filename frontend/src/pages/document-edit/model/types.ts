export type EditablePdfText = {
  id: string;
  str: string;
  x: number;
  y: number;
  fontSize: number;
  fontFamily: string;
  fontWeight?: 'normal' | 'bold';
  fontStyle?: 'normal' | 'italic';
  alignment: 'left' | 'center' | 'right';
  lineBreakAfter: boolean;
};
