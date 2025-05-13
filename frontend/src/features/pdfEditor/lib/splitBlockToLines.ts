export function splitBlockToLines(block: HTMLElement): string[] {
  const lines: string[] = [];
  const text = block.innerText;
  const words = text.split(' ');
  let currentLine = '';

  const initialHeight = Number(block.dataset.initialHeight ?? '0');
  block.style.whiteSpace = 'nowrap';

  for (const word of words) {
    block.innerText = currentLine + (currentLine ? ' ' : '') + word;

    if (block.offsetHeight > initialHeight) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine += (currentLine ? ' ' : '') + word;
    }
  }

  if (currentLine) lines.push(currentLine);
  block.innerText = text;

  return lines;
}
