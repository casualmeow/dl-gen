import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetClose,
  Button,
} from 'entities/components';
import { parsePdfMetadata, type PDFMetadataResult } from 'entities/file';
import { EditableField } from 'shared/ui/editableField';
import { useState, useEffect } from 'react';

type MetadataSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  file: File;
};

export function MetadataSheet({ open, onOpenChange, file }: MetadataSheetProps) {
  const [metadata, setMetadata] = useState<PDFMetadataResult | null>(null);
  const [editedData, setEditedData] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!file) return;

    parsePdfMetadata(file).then((data) => {
      setMetadata(data);
      setEditedData(data.info ?? {});
    });
  }, [file]);

  const handleFieldChange = (key: string, value: string) => {
    setEditedData((prev) => ({ ...prev, [key]: value }));
  };

  if (!metadata) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <EditableField
            label="Title"
            value={editedData.Title ?? ''}
            onChange={(v) => handleFieldChange('Title', v)}
          />
        </SheetHeader>
        <div className="grid gap-4 py-4 px-2 overflow-y-auto max-h-[70vh]">
          {Object.entries(editedData).map(([key, value]) => {
            if (key === 'Title') return null;
            return (
              <EditableField
                key={key}
                label={key}
                value={value}
                onChange={(v) => handleFieldChange(key, v)}
              />
            );
          })}
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button type="submit">Save changes</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
