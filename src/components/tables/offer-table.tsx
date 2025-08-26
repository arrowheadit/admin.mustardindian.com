
// import { useCallback } from "react";
import { useOfferQuery } from "@/queris";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Pagination from "./pagination";
import { Button } from "../ui/button";
import { Archive, Loader ,PencilLine,Search} from "lucide-react";
// import { Archive, Loader, Loader2 ,PencilLine,Search} from "lucide-react";
import { Fragment, useState } from "react";
import UpdateOfferDialog from "../dialogs/update-offer-dialog";
// import DeleteConfigDialog from "../dialogs/DeleteConfigDialog";
// import { useNavigate } from "react-router-dom"; 
// import ConfirmDeleteDialog from "../dialogs/pop-confirm-dialog";
// import {useActiveDeActiveConfigMutation } from "@/mutations";
// import { toast } from "sonner";
import { Input } from "@/components/ui/input"
import type { OfferItem } from "@/types/offers";
// import { Switch } from "@/components/ui/switch";
// import PageActions from "@/components/actions/PageActions";
export default function OfferTable() {
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const page_size = 10; 
    const sort_by = "id";
    const sort_type = "desc";
    // const navigate = useNavigate();    
    // const handleEditPageSection = (page: OfferItem) => {
    //     navigate(`/settings/pages/edit-page-section/${page.slug}`, { state:  page });
    // };
    const { data: offers,isPending } = useOfferQuery({ page, page_size, sort_by, sort_type ,search});
    console.log('offers..', offers);
    const totalPages = offers?.data?.data?.last_page ?? 1; 
    // const { mutateAsync: actDeactivateConfig } = useActiveDeActiveConfigMutation(); 
    // const [deleteTarget, setDeleteTarget] = useState<OfferItem | null>(null);
    // const [actDeactivateTarget, setActDeactivateTarget] = useState<OfferItem | null>(null);
    // const [loadingId,setLoadingId] = useState<number | null>(null);
    const [dialogState, setDialogState] = useState<{
        open: boolean;
        confData?: OfferItem;
    }>({ open: false });

    const offerData = offers?.data?.data?.data ?? [];  
    // const handleActDeactivateTarget = useCallback(() => {
    //      const run = async () => {
    //         if (!actDeactivateTarget) return;
    //         setLoadingId(actDeactivateTarget.id ?? null);
    //         try {
    //             await toast.promise(
    //                 actDeactivateConfig(actDeactivateTarget.id),
    //                 {
    //                     loading: `${actDeactivateTarget.status === "active" ? "Deactivating Config..." : "Activating Config..."}`,
    //                     success: "Config status updated successfully!",
    //                     error: "Error updating offer status.",
    //                 }
    //             );
    //             setActDeactivateTarget(null);
    //         } catch (e) {
    //             console.error(e);
    //         } finally {
    //             setLoadingId(null);
    //         }
    //     };

    //     if (actDeactivateTarget) {
    //         run();
    //     }
    // },[actDeactivateTarget,actDeactivateConfig])
    return (
        <Fragment>
                <div className="hidden flex-1 lg:flex ms-2">
                    <form className="w-full max-w-sm">
                    <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="search"
                            value={search}
                            placeholder="Search..."
                            className="w-full bg-background pl-8 md:w-[300px] lg:w-[400px]"
                            onChange={(e)=>{setSearch(e.target.value)}}
                        />
                    </div>
                    </form>
                </div>
               <Table>
                    <TableHeader>
                         <TableRow>                       
                        <TableHead className="border-r">Name</TableHead>                        
                        <TableHead className="border-r">Title</TableHead>
                        <TableHead className="border-r">Image</TableHead>
                        {/* <TableHead className="border-r">Suggestion</TableHead> */}
                        {/* <TableHead className="border-r">Status</TableHead> */}
                        <TableHead className="border-r">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {offerData.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center border-r">
                                    {isPending ? (
                                        <Loader className="animate-spin" />
                                    ) : (
                                        <div className="flex flex-col items-center min-h-[200px] justify-center space-y-1">
                                            <Archive className="text-blue-400" size={72}/>
                                            <p className="text-gray-500 text-lg">No Offers Found</p>
                                        </div>
                                    )}
                                </TableCell>
                            </TableRow>
                        ): 
                            offerData.slice().sort((a:OfferItem,b:OfferItem)=>Number(b.status)-Number(a.status)).map((offer: OfferItem) => (
                                <TableRow key={offer.id}>
                                    <TableCell className="border-r border-b">{offer.name}</TableCell>
                                    <TableCell className="border-r border-b">{offer.title}</TableCell>
                                     <TableCell className="border-r border-b"><img className="h-12" src={import.meta.env.VITE_FILE_MANAGER_IMAGE_PATH+offer.img_src} alt={offer.img_alt}/>  </TableCell> 
                                   {/* <TableCell  className="border-r border-b">{offer.suggestion}</TableCell> */}
                                    {/* <TableCell className="border-r border-b">
                                        <Switch
                                            className="cursor-pointer"
                                            checked={offer.status=="active"?true:false} 
                                            onCheckedChange={(checked: boolean) => setActDeactivateTarget({ ...offer, status: checked?"active":"inactive" })} 
                                           
                                        />
                                    </TableCell> */}
                                    <TableCell className="border-b">
                                        <div className="flex items-center ">
                                            <Button 
                                                variant="default" 
                                                size="sm" 
                                                onClick={() => setDialogState({ open: true, confData: offer })}
                                            >
                                                <PencilLine />
                                            </Button>
                                            
                                        </div>
                                          {/* <PageActions
                                            page={page}
                                            pageSource="page_table"
                                            onEdit={(page) => setDialogState({ open: true, pageData: page })}
                                            onEditSection={handleEditPageSection}
                                            onSeoSetup={handleSeoSetup}
                                            onDelete={(page) => setDeleteTarget(page)}
                                        /> */}  
                                    </TableCell>
                                </TableRow>
                            ))
                        }                        
                    </TableBody>
                </Table>
                <Pagination
                    currentPage={page}
                    totalPages={totalPages}
                    onPageChange={(newPage) => { setPage(newPage) }}
                    maxButtons={5}
            /> 
            {dialogState.open && (
                <UpdateOfferDialog
                    dialogController={[dialogState.open, (open) => setDialogState({ open, confData: undefined })]}
                    editAbleOffer={dialogState.confData}
                />
            )} 
            
             {/* {deleteTarget && (
                <DeleteConfigDialog
                    offer={deleteTarget}
                    onClose={() => setDeleteTarget(null)}
                />
            )} */}
             {/* {actDeactivateTarget && (
                <ConfirmDeleteDialog
                    open={!!actDeactivateTarget}
                    onOpenChange={(isOpen) => {
                        if (!isOpen) setActDeactivateTarget(null);
                    }}
                    title="Are you sure?"
                    description={`You want to ${
                        actDeactivateTarget.status === "inactive" ? "Deactivate" : "Activate"
                    } "${actDeactivateTarget.id}"`}
                    confirmButton={
                        <Button
                            variant="destructive"
                            onClick={() => handleActDeactivateTarget()}
                            disabled={loadingId === actDeactivateTarget.id}
                        >
                            {loadingId === actDeactivateTarget.id && (
                                <Loader2 className="animate-spin mr-2" />
                            )}
                            {loadingId === actDeactivateTarget.id ? "Processing..." : `${
                        actDeactivateTarget.status == "inactive" ? "Deactivate" : "Activate"
                    }`}
                        </Button>
                    }
                />
            )} */}

        </Fragment>
    );
}
