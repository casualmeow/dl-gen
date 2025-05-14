import { beforeAll, describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import katex from 'katex';
import mermaid from 'mermaid';

import {
  PreviewCode,
  MarkdownDialog,
} from 'pages/document-view/ui/markdown-dialog';
import { usePdfToMarkdown } from 'pages/document-view/model/usePdfToMarkdown';

vi.mock('pages/document-view/model/usePdfToMarkdown');


beforeAll(() => {
  mermaid.render = (_id: string, _config: string) =>
    Promise.resolve({
      svg: `<svg><text>stub</text></svg>`,
      bindFunctions: () => {},
      diagramType: 'mermaid',
    });
});

vi.mocked(usePdfToMarkdown).mockReturnValue({
  markdown: 'hello **world**',
  status:   'idle',
  refresh:  vi.fn(),
  save:     vi.fn(),
});



describe('PreviewCode component', () => {
  it('renders inline math ($...$)', () => {
    const expr = 'x=1+1';
    render(<PreviewCode inline className="" children={`$${expr}$`} />);
    const code = screen.getByRole('code');
    expect(code.innerHTML).toContain(
      katex.renderToString(expr, { throwOnError: false })
    );
  });

  it('renders language-katex blocks via injected getCodeString', () => {
    const math = 'a^2+b^2=c^2';
    const fakeNode = { children: [{ type: 'text', value: 'ignored' }] };
    render(
      <PreviewCode
        inline={false}
        className="language-katex"
        children={[]}
        node={fakeNode}
        _getCodeString={() => math}
      />
    );
    const code = screen.getByRole('code');
    expect(code.innerHTML).toContain(
      katex.renderToString(math, { throwOnError: false })
    );
  });

  it('renders a mermaid-container div for mermaid blocks', async () => {
  const graph = 'graph TD; A-->B;';
  render(
    <PreviewCode
      inline={false}
      className="language-mermaid"
      children={[]}
      node={{ children: [{ type: 'text', value: graph }] }}
    />
  );

  const wrapper = await screen.findByTestId('mermaid-container');
  await waitFor(() => {
    expect(wrapper.innerHTML).toContain('<svg>');
  });
});



  it('falls back to plain <code> for unknown classes', () => {
    render(<PreviewCode inline={false} className="foo" children="plain" />);
    const el = screen.getByText('plain');
    expect(el.tagName).toBe('CODE');
  });
});

describe('MarkdownDialog component', () => {
  it('shows a loading spinner when status is loading', () => {
  vi.mocked(usePdfToMarkdown).mockReturnValueOnce({
    markdown: '',
    status:   'loading',
    refresh:  vi.fn(),
    save:     vi.fn(),
  });

  render(
    <MarkdownDialog
      isOpen
      onOpenChange={() => {}}
      fileId="123"
      pdfBlob={new Blob()}
    />
  );

  expect(screen.getByRole('status')).toBeInTheDocument();
});


  it('has a “Refresh” button in the toolbar', () => {
    render(
      <MarkdownDialog
        isOpen
        onOpenChange={() => {}}
        fileId="123"
        pdfBlob={new Blob()}
      />
    );
    expect(screen.getByLabelText('Refresh')).toBeInTheDocument();
  });

  it('renders the Markdown in the Preview tab', async () => {
    render(
      <MarkdownDialog
        isOpen
        onOpenChange={() => {}}
        fileId="123"
        pdfBlob={new Blob()}
      />
    );

    fireEvent.click(screen.getByText('Preview'));

    await waitFor(() => {
      const found = screen.getAllByText(/hello|world/);
      expect(found.length).toBeGreaterThanOrEqual(2);
    });
  });
});

describe('MarkdownDialog component (Preview tab rendering)', () => {
  // existing mermaid test lives here…

  it('renders KaTeX math in the Preview tab', async () => {
    // 1) Mock the hook to return some inline‐and‐block math
    vi.mocked(usePdfToMarkdown).mockReturnValueOnce({
      markdown: 'Here is inline math $x=1+1$ and a block:\n\n```katex\na^2+b^2=c^2\n```',
      status: 'idle',
      refresh: vi.fn(),
      save: vi.fn(),
    });

    const { container } = render(
      <MarkdownDialog
        isOpen
        onOpenChange={() => {}}
        fileId="math"
        pdfBlob={new Blob()}
      />
    );

    // 2) Flip over to Preview
    fireEvent.click(screen.getByText('Preview'));

    // 3) Wait for KaTeX to inject its .katex wrapper
    await waitFor(() => {
      // Debug output
      // console.log(container.innerHTML);
      expect(container.querySelector('.katex')).not.toBeNull();
    }, { timeout: 2000 });
  });

  it('renders mermaid diagrams in the Preview tab', async () => {
    // 1) Mock the hook to return a mermaid fence
    const graph = 'graph LR; A-->B;';
    vi.mocked(usePdfToMarkdown).mockReturnValueOnce({
      markdown: `And a mermaid diagram:\n\n\`\`\`mermaid\n${graph}\n\`\`\``,
      status: 'idle',
      refresh: vi.fn(),
      save: vi.fn(),
    });

    const { container } = render(
      <MarkdownDialog
        isOpen
        onOpenChange={() => {}}
        fileId="mermaid"
        pdfBlob={new Blob()}
      />
    );

    // 2) Switch to Preview
    fireEvent.click(screen.getByText('Preview'));

    // 3) Mermaid stub (from your beforeAll) will synchronously render an <svg>
    await waitFor(() => {
      expect(container.querySelector('svg')).toBeInTheDocument();
    }, { timeout: 2000 });

    const mermaidDiv = await screen.findByTestId('mermaid-container', {}, { timeout: 2000 });
    expect(mermaidDiv.innerHTML).toContain('<svg>');
  });
});