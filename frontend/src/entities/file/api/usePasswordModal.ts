import { useState } from 'react';

export function usePasswordModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [onSubmit, setOnSubmit] = useState<(password: string) => void>(() => () => {});
  const [error, setError] = useState('');

  const open = (submitCallback: (password: string) => void) => {
    setError('');
    setOnSubmit(() => submitCallback);
    setIsOpen(true);
  };

  const close = () => setIsOpen(false);

  const submit = (password: string) => {
    if (!password) {
      setError('Set password');
      return;
    }
    onSubmit(password);
    close();
  };

  return { isOpen, open, close, submit, error };
}
