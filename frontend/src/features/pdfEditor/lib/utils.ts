export const getParagraphHeight = (fontSize: number, zoom: number) => {
  return fontSize * 1.3 * (zoom / 100);
};

export const getElementHeight = (el: HTMLElement | null, fontSize: number, zoom: number) => {
  if (el && el.offsetHeight > 0) {
    return el.offsetHeight;
  }
  // Fallback to calculated height
  return getParagraphHeight(fontSize, zoom);
};

export const PAGE_PADDING = 40;
