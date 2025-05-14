import { describe, it, expect } from 'vitest';
import { getCodeString } from 'rehype-rewrite';

describe('getCodeString utility', () => {
  it('concatenates text nodes into a single string', () => {
    const nodes = [
      { type: 'text', value: 'Hello' },
      { type: 'text', value: ' ' },
      { type: 'text', value: 'World' },
    ];
    expect(getCodeString(nodes as any)).toBe('Hello World');
  });

  it('works with mixed node types (only text nodes collected)', () => {
    const nodes = [
      { type: 'text', value: 'foo' },
      { type: 'element', tagName: 'span', children: [] },
      { type: 'text', value: 'bar' },
    ];
    expect(getCodeString(nodes as any)).toBe('foobar');
  });

  it('returns empty string for empty array', () => {
    expect(getCodeString([])).toBe('');
  });
});
