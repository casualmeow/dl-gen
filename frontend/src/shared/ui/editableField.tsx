import { Button, Label, Input } from 'entities/components';
import { useState, useRef, useEffect } from 'react';

interface SidebarEditableFieldProps {
  label: string;
  value: string;
  onChange: (newValue: string) => void;
  editable?: boolean;
}

export function EditableField({
  label,
  value,
  onChange,
  editable = true,
}: SidebarEditableFieldProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [internalValue, setInternalValue] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
    }
  }, [isEditing]);

  const handleSave = () => {
    setIsEditing(false);
    if (internalValue !== value) {
      onChange(internalValue);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setInternalValue(value);
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor={`sidebar-field-${label}`}>{label}</Label>

      {isEditing && editable ? (
        <Input
          id={`sidebar-field-${label}`}
          ref={inputRef}
          value={internalValue}
          onChange={(e) => setInternalValue(e.target.value)}
          onBlur={handleSave}
          onKeyDown={handleKeyDown}
        />
      ) : (
        <div className="flex items-center justify-between gap-2">
          <span className="text-muted-foreground truncate">{value}</span>
          {editable && (
            <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)}>
              Edit
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
