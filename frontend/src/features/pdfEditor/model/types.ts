export interface EditablePdfText {
  id: string;
  pageNumber: number;
  str: string; // plain text
  html: string; // innerHTML (rich)
  x: number;
  y: number;
  width: number;
  height: number;
  fontSize: number;
  fontFamily: string;
  alignment: 'left' | 'center' | 'right';
  fontWeight?: 'normal' | 'bold';
  fontStyle?: 'normal' | 'italic';
  lineBreakAfter?: boolean;
}

export interface EditablePdfBlock extends EditablePdfText {
  id: string;
  pageNumber: number;
  html: string;
}
