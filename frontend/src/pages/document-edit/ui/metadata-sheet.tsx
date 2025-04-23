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
  const [_metadata, setMetadata] = useState<PDFMetadataResult | null>(null);
  const [editedData, setEditedData] = useState<Record<string, string>>({});

  useEffect(() => {
    parsePdfMetadata(file).then((data) => {
      setMetadata(data);
      setEditedData(data.info ?? {});
    });
  }, [file]);

  const handleFieldChange = (key: string, value: string) => {
    setEditedData((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <h3 className="text-xl font-semibold">Properties</h3>
        </SheetHeader>
        <div className="grid gap-4 py-4 px-2 overflow-y-auto max-h-[70vh]">
          {Object.entries(editedData).map(([key, value]) => {
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
