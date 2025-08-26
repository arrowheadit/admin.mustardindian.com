import { useLocation,useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { usePageSectionQuery } from "@/queris";
import { AccordionSectionContent } from "@/components/pages/AccordionSectionContent";
import { AccordionSection } from "@/components/pages/AccordionSection";
import { AccordionSectionList } from "@/components/pages/AccordionSectionList";
import { snackCaseToUpperCase } from "@/utils";
import Pagination from "@/components/tables/pagination";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import type { PageSection } from "@/types/pages";
import {Forward} from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { toast } from "sonner";
import PageActions from "@/components/actions/PageActions";
import type { PageItem} from "@/types/pages";
import AddPageDialog from "@/components/dialogs/add-page-dialog";
import DeletePageDialog from "@/components/dialogs/DeletePageDialog";
import { PlusIcon } from "lucide-react";
export function EditPageSection() {
  const location = useLocation();
  const pageData = location.state; 
  const navigate = useNavigate(); 
  const individualPageManagement = (targetPage: string) => {
    if (targetPage === "Offer Section") {
      navigate('/offers');
    }
    if (targetPage === "Gallery Section") {
      navigate('/gallery');
    }
    
  }
  const [formContent, setFormContent] = useState<[]>([]);
  //  const [setOpenItem] = useState<string | null>(null);
  // const [openAddNewSection, setOpenAddNewSection] = useState(false);
  const [dialogState, setDialogState] = useState<{
        open: boolean;
        pageData?: PageItem;
        isSectionOpen?: boolean;
    }>({ open: false ,isSectionOpen:false});
  const handleSeoSetup = (page: PageItem) => {
        navigate(`/settings/pages/seo-setup/${page.slug}`, { state:  page });
  };
  const [deleteTarget, setDeleteTarget] = useState<PageItem | null>(null);
  const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const page_size = 15; 
    const sort_by = "display_order";
    const sort_type = "asc";
  const { data: pageSections } = usePageSectionQuery({ page, page_size, sort_by, sort_type, search, slug: pageData.slug });
  const totalPages = pageSections?.data?.data?.last_page ?? 1;
      console.log("section data in EditPageSection", pageSections, pageData);  
  useEffect(() => {
  if (!pageSections) return;

  try {
    const sectionData = pageSections?.data?.data?.data ?? [];
    setFormContent(sectionData);

    // Log sectionData directly instead of stale formContent
    console.log("Page Sections in EditPageSection...", sectionData,pageSections);
  } catch (error) {
    console.error("Error parsing page sections", error);
    // setFormContent(null); // Uncomment if you want a fallback
  }
}, [pageSections]);
useEffect(() => {
  if (formContent) {
    console.log("Updated formContent", formContent);
  }
}, [formContent]);
 
  const [accordionSectionContentKey, setAccordionSectionContentKey] = useState(0);
  const [isNewSection, setIsNewSection] = useState(true);
  const setMutationType = (type: "add" | "edit") => { 
    console.log("setMutationType called with type:", type);
    if(type === "add") {
      setAccordionSectionContentKey((prevKey) => prevKey + 1);   
      setIsNewSection(true);
    }
  }
  const individualPages = ['Offer Section', 'Gallery Section'];
  return (
    <section className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="items-center space-y-2">
          <h1 className="text-2xl font-bold">Update: {pageData?.title} Page Sections</h1>
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
        </div>
        
        {pageData &&
          <div className="inline-flex items-center justify-center bg-green-400 rounded-md">
          <PageActions
            page={pageData}
            pageSource="edit_section"
            onEdit={(page) => setDialogState({ open: true, pageData: page })}
            onEditSection={() => toast("Edit Section Page clicked")}
            onSeoSetup={handleSeoSetup}
            onDelete={(page) => setDeleteTarget(page)}
          />
           </div>
        }
      </div>      
      <Accordion type="single" collapsible className="space-y-2">
        {pageSections?.data?.data?.data &&
        Object.entries(pageSections.data.data.data as Record<string, PageSection>).map(
          ([key, typedSection]) => {
            return (<AccordionItem key={key} value={`item-${key}`} className="border rounded-md px-4">
              <AccordionTrigger>{typedSection.name}</AccordionTrigger>
              <AccordionContent>
                {typedSection.title && (
                  <AccordionSection selectedSectionData={typedSection} />
                )}                
                {typedSection.has_content && typedSection.content_contents && typedSection.content_contents.length > 0 ?
                  typedSection.content_contents.map((content, index) => (
                    <div className="space-y-4 mb-2" key={index}>
                      <h2 className="text-lg align-middle font-semibold bg-blue-500 text-white rounded-lg mt-3 p-4">{snackCaseToUpperCase(content.name ?? "")}</h2>
                      <AccordionSectionContent selectedSectionData={content} />
                    </div>
                  )) : ""
                }
                {typedSection.has_list && individualPages.includes(typedSection.name??"") ? <Button className="mt-4 bg-[#487eb0]" onClick={()=>individualPageManagement(typedSection.name??"")}>{typedSection.name} Management <Forward /></Button> : typedSection.has_list ? 
                  (<div className="space-y-4 mt-5">
                    <div className="content-start items-center mb-4">
                      <h2 className="text-lg align-middle font-semibold bg-blue-500 text-white rounded-lg mt-3 p-4">List Content</h2>
                      <Button className="mt-4" variant="default" onClick={() => setMutationType("add")}>
                        <PlusIcon />
                        New Item
                      </Button>
                    </div>
                    <AccordionSectionList key={accordionSectionContentKey} hideElement={ typedSection.hide_element} sectionName={typedSection.name }  isNewSection={isNewSection} selectedSectionData={typedSection.list_contents} sectionId={typedSection.id} />
                    
                  </div>):""
                }
              </AccordionContent>
            </AccordionItem>)
          })}

      </Accordion>
      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={(newPage) => { setPage(newPage) }}
        maxButtons={5}
      /> 
      {/* <PageSectionTable/> */}
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
    </section>
  );
}
