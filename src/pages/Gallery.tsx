import UpdateGalleryDialog from "@/components/dialogs/update-gallery-dialog";
import GalleryTable from "@/components/tables/gallery-table";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { useState } from "react";

export function Gallery() {
  const [open, setOpen] = useState(false);
  
  return (
    <section className="space-y-4 ">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Gallery</h1>
        <Button variant="default" onClick={() => setOpen(true)}>
          <PlusIcon />
          Add New Gallery
        </Button> 
         {open && ( 
          <UpdateGalleryDialog dialogController={[open, setOpen]} />
        )}
      </div>
      <GalleryTable />
    </section>
  )
}
