import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "entities/components";
import { Button } from "entities/components";
import { useTranslation } from 'react-i18next';

interface ConfigModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  variables: string[];
  values: { [key: string]: string };
  onChange: (variable: string, value: string) => void;
  onApply: () => void;
}

export function ConfigModal({ open, onOpenChange, variables, values, onChange, onApply } : ConfigModalProps) {
  const { t } = useTranslation();
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('configDialog.title')}</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={e => {
            e.preventDefault();
            onApply();
          }}
        >
          <div className="space-y-4">
            {variables.map(variable => (
              <div key={variable} className="flex flex-col gap-1">
                <label className="font-medium">{variable}</label>
                <input
                  className="input input-bordered"
                  value={values[variable] || ''}
                  onChange={e => onChange(variable, e.target.value)}
                  placeholder={t('configDialog.placeholder', { variable })}
                />
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button type="submit">{t('configDialog.apply')}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
