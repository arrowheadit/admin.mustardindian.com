
import { useCallback } from "react";
import { usePageQuery } from "@/queris";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Pagination from "./pagination";
import { Button } from "../ui/button";
import { Archive, Loader, Loader2 ,Search} from "lucide-react";
import { Fragment, useState } from "react";
import AddPageDialog from "../dialogs/add-page-dialog";
import DeletePageDialog from "../dialogs/DeletePageDialog";
import { useNavigate } from "react-router-dom"; 
import ConfirmDeleteDialog from "../dialogs/pop-confirm-dialog";
import {useActiveDeActivePageMutation } from "@/mutations";
import { toast } from "sonner";
import { Input } from "@/components/ui/input"
import type { PageItem } from "@/types/pages";
import { Switch } from "@/components/ui/switch";
import PageActions from "@/components/actions/PageActions";
export default function PageTable() {
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const page_size = 5; 
    const sort_by = "id";
    const sort_type = "desc";
    const navigate = useNavigate();    
    const handleEditPageSection = (page: PageItem) => {
        navigate(`/settings/pages/edit-page-section/${page.slug}`, { state:  page });
    };
    const handleSeoSetup = (page: PageItem) => {
        navigate(`/settings/pages/seo-setup/${page.slug}`, { state:  page });
    };
  
    const { data: pages,isPending } = usePageQuery({ page, page_size, sort_by, sort_type ,search});
    console.log('Pages..', pages);
    const totalPages = pages?.data?.data?.last_page ?? 1; 
    const { mutateAsync: actDeactivatePage } = useActiveDeActivePageMutation(); 
    const [deleteTarget, setDeleteTarget] = useState<PageItem | null>(null);
    const [actDeactivateTarget, setActDeactivateTarget] = useState<PageItem | null>(null);
        const [loadingId,setLoadingId] = useState<number | null>(null);
    const [dialogState, setDialogState] = useState<{
        open: boolean;
        pageData?: PageItem;
        isSectionOpen?: boolean;
    }>({ open: false ,isSectionOpen:false});

    const pageList = pages?.data?.data?.data ?? [];  
    const handleActDeactivateTarget = useCallback(() => {
         const run = async () => {
            if (!actDeactivateTarget) return;
            setLoadingId(actDeactivateTarget.id);
            try {
                await toast.promise(
                    actDeactivatePage(actDeactivateTarget.slug),
                    {
                        loading: `${actDeactivateTarget.status === "active" ? "Deactivating Page..." : "Activating Page..."}`,
                        success: "Page status updated successfully!",
                        error: "Error updating page status.",
                    }
                );
                setActDeactivateTarget(null);
            } catch (e) {
                console.error(e);
            } finally {
                setLoadingId(null);
            }
        };

        if (actDeactivateTarget) {
            run();
        }
    },[actDeactivateTarget,actDeactivatePage])
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
                        <TableHead className="border-r">Title</TableHead>
                        <TableHead className="border-r">Slug</TableHead>
                        <TableHead className="border-r">Status</TableHead>
                        <TableHead className="border-r"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {pageList.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center border-r">
                                    {isPending ? (
                                        <Loader className="animate-spin" />
                                    ) : (
                                        <div className="flex flex-col items-center min-h-[200px] justify-center space-y-1">
                                            <Archive className="text-blue-400" size={72}/>
                                            <p className="text-gray-500 text-lg">No Page Found</p>
                                        </div>
                                    )}
                                </TableCell>
                            </TableRow>
                        ): 
                            pageList.slice().sort((a:PageItem,b:PageItem)=>Number(b.status)-Number(a.status)).map((page: PageItem) => (
                                <TableRow key={page.id}>
                                    <TableCell className="border-r border-b">{page.title}</TableCell>
                                    <TableCell  className="border-r border-b">{page.slug}</TableCell>
                                   
                                    <TableCell className="border-r border-b">
                                        <Switch
                                            className="cursor-pointer"
                                            checked={page.status=="active"?true:false} 
                                            onCheckedChange={(checked: boolean) => setActDeactivateTarget({ ...page, status: checked?"active":"inactive" })} 
                                            disabled={loadingId === deleteTarget?.id}
                                        />
                                    </TableCell>
                                    <TableCell className="border-b">
                                          <PageActions
                                            page={page}
                                            pageSource="page_table"
                                            onEdit={(page) => setDialogState({ open: true, pageData: page })}
                                            onEditSection={handleEditPageSection}
                                            onSeoSetup={handleSeoSetup}
                                            onDelete={(page) => setDeleteTarget(page)}
                                        />
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
                <AddPageDialog
                    dialogController={[dialogState.open, (open) => setDialogState({ open, pageData: undefined })]}
                    editAblePage={dialogState.pageData}
                />
            )} 
            
             {deleteTarget && (
                <DeletePageDialog
                    page={deleteTarget}
                    onClose={() => setDeleteTarget(null)}
                />
            )}
             {actDeactivateTarget && (
                <ConfirmDeleteDialog
                    open={!!actDeactivateTarget}
                    onOpenChange={(isOpen) => {
                        if (!isOpen) setActDeactivateTarget(null);
                    }}
                    title="Are you sure?"
                    description={`You want to ${
                        actDeactivateTarget.status === "inactive" ? "Deactivate" : "Activate"
                    } "${actDeactivateTarget.title}"`}
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
            )}

        </Fragment>
    );
}
