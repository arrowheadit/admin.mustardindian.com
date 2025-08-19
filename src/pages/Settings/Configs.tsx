// import AddPageDialog from "@/components/dialogs/add-page-dialog";
import ConfigTable from "@/components/tables/config-table";
// import { Button } from "@/components/ui/button";
// import { PlusIcon } from "lucide-react";
// import { useState } from "react";
export function Configs() {
  // const [open, setOpen] = useState(false);
  
  return (
    <section className="space-y-4 ">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Configs</h1>
        {/* <Button variant="default" onClick={() => setOpen(true)}>
          <PlusIcon />
          Add New Page
        </Button> 
         {open && ( 
          <AddPageDialog dialogController={[open, setOpen]} />
        )} */}
      </div>
      <ConfigTable />
    </section>
  )
}
