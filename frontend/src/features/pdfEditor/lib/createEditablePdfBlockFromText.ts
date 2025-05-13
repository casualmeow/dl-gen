import type { PdfText } from 'pages/document-edit';
import type { EditablePdfBlock } from '../model/types';

export function createEditablePdfBlockFromText(
  t: PdfText,
  pageNumber: number,
  index: number,
): EditablePdfBlock {
  return {
    id: `block-${pageNumber}-${index}`,
    pageNumber,
    str: t.str,
    html: t.str,
    x: t.x,
    y: t.y,
    width: t.width,
    height: t.height,
    fontSize: t.fontSize,
    fontFamily: t.fontFamily,
    alignment: t.alignment,
    fontWeight: t.isBold ? 'bold' : 'normal',
    fontStyle: t.isItalic ? 'italic' : 'normal',
    lineBreakAfter: t.lineBreakAfter ?? false,
  };
}
