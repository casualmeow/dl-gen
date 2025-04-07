import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetClose,
    Button,
    Input,
    Label,
  } from "entities/components"
import { parsePdfMetadata } from "entities/file"
import { EditableField } from "shared/ui/editableField"
  
  type MetadataSheetProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
  }
  
  export function MetadataSheet({ open, onOpenChange }: MetadataSheetProps) {

    const getMetadata = await parsePdfMetadata(File)

    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent>
          <SheetHeader>
            <EditableField value="" />
          </SheetHeader>
          <div className="grid gap-4 py-4 px-5">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input id="name" value="Pedro Duarte" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="username" className="text-right">
                Username
              </Label>
              <Input id="username" value="@peduarte" className="col-span-3" />
            </div>
          </div>
          <SheetFooter>
            <SheetClose asChild>
              <Button type="submit">Save changes</Button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    )
  }
  