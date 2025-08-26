import UpdateOfferDialog from "@/components/dialogs/update-offer-dialog";
import OfferTable from "@/components/tables/offer-table";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { useState } from "react";
export function Offers() {
  const [open, setOpen] = useState(false);
  
  return (
    <section className="space-y-4 ">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Offers</h1>
        <Button variant="default" onClick={() => setOpen(true)}>
          <PlusIcon />
          Add New Offer
        </Button> 
         {open && ( 
          <UpdateOfferDialog dialogController={[open, setOpen]} />
        )}
      </div>
      <OfferTable />
    </section>
  )
}
