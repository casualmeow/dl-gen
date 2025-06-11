import { render, screen, fireEvent } from '@testing-library/react';
import { FileItem } from 'shared/ui/upload/ui/item';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter } from 'react-router';
import { ChoiceDialog } from 'shared/ui/upload';

describe('FileItem', () => {
  it('renders file name and type', () => {
    const file = new File(['dummy'], 'test.pdf', { type: 'application/pdf' });
    render(<FileItem file={file} onRemove={vi.fn()} />);
    expect(screen.getByText('test.pdf')).toBeInTheDocument();
    expect(screen.getByText('PDF')).toBeInTheDocument();
  });

  it('calls onRemove when remove button is clicked', () => {
    const file = new File(['dummy'], 'test.pdf', { type: 'application/pdf' });
    const onRemove = vi.fn();
    render(<FileItem file={file} onRemove={onRemove} />);
    fireEvent.click(screen.getByRole('button', { name: /remove file/i }));
    expect(onRemove).toHaveBeenCalled();
  });
});

describe('ChoiceDialog', () => {
  it('renders dialog and file info', () => {
    const file = new File(['dummy'], 'test.pdf', { type: 'application/pdf' });
    render(
      <MemoryRouter>
        <ChoiceDialog open={true} onOpenChange={() => {}} fileId="123" file={file} />
      </MemoryRouter>
    );
    expect(
      screen.getAllByText(
        (content) =>
          content.toLowerCase().includes('choiceDialog.title'.toLowerCase()) ||
          content.toLowerCase().includes('document options')
      ).length
    ).toBeGreaterThan(0);
    expect(
      screen.getAllByText(
        (content) =>
          content.toLowerCase().includes('choiceDialog.description'.toLowerCase()) ||
          content.toLowerCase().includes('select what you want to do with the document')
      ).length
    ).toBeGreaterThan(0);
    expect(screen.getByText('test.pdf')).toBeInTheDocument();
    expect(screen.getByText('PDF')).toBeInTheDocument();
  });

  it('calls onOpenChange when cancel is clicked', () => {
    const onOpenChange = vi.fn();
    render(
      <MemoryRouter>
        <ChoiceDialog open={true} onOpenChange={onOpenChange} fileId="123" file={undefined} />
      </MemoryRouter>
    );
    fireEvent.click(
      screen.getByText((content) =>
        content.toLowerCase().includes('choiceDialog.cancel'.toLowerCase()) ||
        content.toLowerCase().includes('cancel')
      )
    );
    expect(onOpenChange).toHaveBeenCalled();
  });
}); 