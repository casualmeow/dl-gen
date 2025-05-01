export interface EditablePdfText {
    str: string;
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
  }
  