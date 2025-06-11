import { render, screen, fireEvent } from '@testing-library/react';
import { ChoiceDialog } from 'shared/ui/upload/ui/choice-dialog';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter } from 'react-router';
import { I18nextProvider } from 'react-i18next';
import i18n from 'shared/lib/i18n';

describe('ChoiceDialog', () => {
  it('renders dialog and file info', () => {
    const file = new File(['dummy'], 'test.pdf', { type: 'application/pdf' });
    render(
      <I18nextProvider i18n={i18n}>
        <MemoryRouter>
          <ChoiceDialog open={true} onOpenChange={() => {}} fileId="123" file={file} />
        </MemoryRouter>
      </I18nextProvider>
    );
    expect(screen.getByText((content) => content.toLowerCase().includes('download completed') || content.toLowerCase().includes('choiceDialog.title'))).toBeInTheDocument();
    expect(screen.getByText('test.pdf')).toBeInTheDocument();
    expect(screen.getByText('PDF')).toBeInTheDocument();
  });

  it('calls onOpenChange when cancel is clicked', () => {
    const onOpenChange = vi.fn();
    render(
      <I18nextProvider i18n={i18n}>
        <MemoryRouter>
          <ChoiceDialog open={true} onOpenChange={onOpenChange} fileId="123" file={undefined} />
        </MemoryRouter>
      </I18nextProvider>
    );
    fireEvent.click(screen.getByText((content) => content.toLowerCase().includes('cancel') || content.toLowerCase().includes('choicedialog.cancel')));
    expect(onOpenChange).toHaveBeenCalled();
  });
}); 