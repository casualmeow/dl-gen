import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from 'entities/components';
import { useNavigate, useParams } from 'react-router';
import { useState, useEffect } from 'react';
import { MetadataSheet } from './metadata-sheet';

export function EditMenubar() {
  const navigate = useNavigate();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [currentFile, setCurrentFile] = useState<File | null>(null);
  
  useEffect(() => {
    const { fileId } = useParams();
    if (fileId) {
      fetch(`/api/files/${fileId}`)
        .then((res) => res.blob())
        .then((blob) => {
          const file = new File([blob], `document-${fileId}.pdf`, { type: 'application/pdf' });
          setCurrentFile(file);
        })
        .catch((err) => console.error('Error loading file for metadata:', err));
    }
  }, []);

  return (
    <>
      {currentFile && (
        <MetadataSheet open={isSheetOpen} onOpenChange={setIsSheetOpen} file={currentFile} />
      )}

      <Menubar>
        <MenubarMenu>
          <MenubarTrigger>File</MenubarTrigger>
          <MenubarContent>
            <MenubarItem>New</MenubarItem>
            <MenubarItem>Open</MenubarItem>
            <MenubarItem>Save</MenubarItem>
            <MenubarItem>Export</MenubarItem>
            <MenubarItem onClick={() => setIsSheetOpen(true)}>Properties</MenubarItem>
            <MenubarItem>Print</MenubarItem>
            <MenubarItem onClick={() => navigate('/')}>Exit</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
        <MenubarSeparator />
        <MenubarMenu>
          <MenubarTrigger>Edit</MenubarTrigger>
          <MenubarContent>
            <MenubarItem>Undo</MenubarItem>
            <MenubarItem>Redo</MenubarItem>
            <MenubarItem>Cut</MenubarItem>
            <MenubarItem>Copy</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
        <MenubarSeparator />
        <MenubarMenu>
          <MenubarTrigger>View</MenubarTrigger>
          <MenubarContent>
            <MenubarItem>Zoom In</MenubarItem>
            <MenubarItem>Zoom Out</MenubarItem>
            <MenubarItem>Actual Size</MenubarItem>
            <MenubarItem>Fit Page</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
        <MenubarSeparator />
        <MenubarMenu>
          <MenubarTrigger>Help</MenubarTrigger>
          <MenubarContent>
            <MenubarItem>About</MenubarItem>
            <MenubarItem>AI assistant</MenubarItem>
            <MenubarItem>Documentation</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    </>
  );
}
