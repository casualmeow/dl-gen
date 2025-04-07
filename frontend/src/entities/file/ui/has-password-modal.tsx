
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from 'entities/components';
import { Input } from 'entities/components';
import { Button } from 'entities/components';
import { useState } from 'react';

type Props = {
  isOpen: boolean;
  onSubmit: (password: string) => void;
  onClose: () => void;
  error?: string;
};

export const PasswordDialog = ({ isOpen, onSubmit, onClose, error }: Props) => {
  const [password, setPassword] = useState('');

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>This document is protected</DialogTitle>
        </DialogHeader>
        <Input
          type="password"
          placeholder="Введите пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <DialogFooter>
          <Button onClick={() => onSubmit(password)}>Enter</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
