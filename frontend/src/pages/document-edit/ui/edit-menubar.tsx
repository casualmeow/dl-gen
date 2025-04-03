import {
    Menubar,
    // MenubarCheckboxItem,
    MenubarContent,
    MenubarItem,
    MenubarMenu,
    // MenubarRadioGroup,
    // MenubarRadioItem,
    MenubarSeparator,
    // MenubarShortcut,
    // MenubarSub,
    // MenubarSubContent,
    // MenubarSubTrigger,
    MenubarTrigger,

} from 'entities/components';
import { useNavigate } from 'react-router';
import { useState } from 'react';
import { MetadataSheet } from './metadata-sheet'



export function EditMenubar() {
  const navigate = useNavigate();
  const [isSheetOpen, setIsSheetOpen] = useState(false)

  return (
    //     <Menubar>
    //       <MenubarMenu>
    //         <MenubarTrigger>File</MenubarTrigger>
    //         <MenubarContent>
    //           <MenubarItem>
    //             New Tab <MenubarShortcut>⌘T</MenubarShortcut>
    //           </MenubarItem>
    //           <MenubarItem>
    //             New Window <MenubarShortcut>⌘N</MenubarShortcut>
    //           </MenubarItem>
    //           <MenubarItem disabled>New Incognito Window</MenubarItem>
    //           <MenubarSeparator />
    //           <MenubarSub>
    //             <MenubarSubTrigger>Share</MenubarSubTrigger>
    //             <MenubarSubContent>
    //               <MenubarItem>Email link</MenubarItem>
    //               <MenubarItem>Messages</MenubarItem>
    //               <MenubarItem>Notes</MenubarItem>
    //             </MenubarSubContent>
    //           </MenubarSub>
    //           <MenubarSeparator />
    //           <MenubarItem>
    //             Print... <MenubarShortcut>⌘P</MenubarShortcut>
    //           </MenubarItem>
    //         </MenubarContent>
    //       </MenubarMenu>
    //       <MenubarMenu>
    //         <MenubarTrigger>Edit</MenubarTrigger>
    //         <MenubarContent>
    //           <MenubarItem>
    //             Undo <MenubarShortcut>⌘Z</MenubarShortcut>
    //           </MenubarItem>
    //           <MenubarItem>
    //             Redo <MenubarShortcut>⇧⌘Z</MenubarShortcut>
    //           </MenubarItem>
    //           <MenubarSeparator />
    //           <MenubarSub>
    //             <MenubarSubTrigger>Find</MenubarSubTrigger>
    //             <MenubarSubContent>
    //               <MenubarItem>Search the web</MenubarItem>
    //               <MenubarSeparator />
    //               <MenubarItem>Find...</MenubarItem>
    //               <MenubarItem>Find Next</MenubarItem>
    //               <MenubarItem>Find Previous</MenubarItem>
    //             </MenubarSubContent>
    //           </MenubarSub>
    //           <MenubarSeparator />
    //           <MenubarItem>Cut</MenubarItem>
    //           <MenubarItem>Copy</MenubarItem>
    //           <MenubarItem>Paste</MenubarItem>
    //         </MenubarContent>
    //       </MenubarMenu>
    //       <MenubarMenu>
    //         <MenubarTrigger>View</MenubarTrigger>
    //         <MenubarContent>
    //           <MenubarCheckboxItem>Always Show Bookmarks Bar</MenubarCheckboxItem>
    //           <MenubarCheckboxItem checked>Always Show Full URLs</MenubarCheckboxItem>
    //           <MenubarSeparator />
    //           <MenubarItem inset>
    //             Reload <MenubarShortcut>⌘R</MenubarShortcut>
    //           </MenubarItem>
    //           <MenubarItem disabled inset>
    //             Force Reload <MenubarShortcut>⇧⌘R</MenubarShortcut>
    //           </MenubarItem>
    //           <MenubarSeparator />
    //           <MenubarItem inset>Toggle Fullscreen</MenubarItem>
    //           <MenubarSeparator />
    //           <MenubarItem inset>Hide Sidebar</MenubarItem>
    //         </MenubarContent>
    //       </MenubarMenu>
    //       <MenubarMenu>
    //         <MenubarTrigger>Profiles</MenubarTrigger>
    //         <MenubarContent>
    //           <MenubarRadioGroup value="benoit">
    //             <MenubarRadioItem value="andy">Andy</MenubarRadioItem>
    //             <MenubarRadioItem value="benoit">Benoit</MenubarRadioItem>
    //             <MenubarRadioItem value="Luis">Luis</MenubarRadioItem>
    //           </MenubarRadioGroup>
    //           <MenubarSeparator />
    //           <MenubarItem inset>Edit...</MenubarItem>
    //           <MenubarSeparator />
    //           <MenubarItem inset>Add Profile...</MenubarItem>
    //         </MenubarContent>
    //       </MenubarMenu>
    //     </Menubar>
    //   )
    <>
      <MetadataSheet open={isSheetOpen} onOpenChange={setIsSheetOpen} />

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
