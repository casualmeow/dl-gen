import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { UploadModal } from 'shared/ui/upload/ui/modal';
import { ToastProvider } from 'shared/ui/upload/api/toast-provider';
import { UploadProvider } from 'shared/ui/upload/api/provider';
import { I18nextProvider } from 'react-i18next';
import i18n from 'shared/lib/i18n';

function renderWithProviders(ui: React.ReactElement) {
  return render(
    <I18nextProvider i18n={i18n}>
      <UploadProvider>
        <ToastProvider>{ui}</ToastProvider>
      </UploadProvider>
    </I18nextProvider>
  );
}

describe('UploadModal', () => {

  it('shows uploading state when files are added', async () => {
    const file = new File(['dummy'], 'test.pdf', { type: 'application/pdf' });
    renderWithProviders(<UploadModal initialFiles={[file]} />);
    const uploadingEls = await screen.findAllByText((content) => content.toLowerCase().includes('uploading documents') || content.toLowerCase().includes('uploadmodal.uploading'));
    expect(uploadingEls.length).toBeGreaterThan(0);
  });

  it('shows upload complete after upload', async () => {
    const file = new File(['dummy'], 'test.pdf', { type: 'application/pdf' });
    renderWithProviders(<UploadModal initialFiles={[file]} />);
    await screen.findAllByText((content) => content.toLowerCase().includes('uploading documents') || content.toLowerCase().includes('uploadmodal.uploading'));
    await waitFor(() => {
      const completeEls = screen.getAllByText((content) => content.toLowerCase().includes('upload complete') || content.toLowerCase().includes('uploadmodal.uploadcomplete'));
      expect(completeEls.length).toBeGreaterThan(0);
    }, { timeout: 4000 });
  });
}); 