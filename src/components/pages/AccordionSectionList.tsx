import { useState, useEffect } from "react";
import { useQueryClient } from '@tanstack/react-query'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {Save}  from "lucide-react";
import { Card,
        // CardAction,
        // CardContent,
        // CardDescription,
        // CardFooter,
        // CardHeader,
        CardTitle,
} from "../ui/card";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Textarea } from "@/components/ui/textarea"
import { useLocation } from "react-router-dom";
import type { PageSectionContent } from "@/types/pages";
import ImageCard from "../image/image-card";
import { useCreateListContentMutation, useUpdateListContentMutation, useDeleteListContentMutation } from "@/mutations";
import { useControlListElementsQuery } from "@/queris";
import { toast } from "sonner";
import type { FileItem } from "@/types/file-manager";
import ConfirmDeleteDialog from "@/components/dialogs/pop-confirm-dialog";
import { Trash2, Loader2 } from "lucide-react";
// import type { ControlListElement } from "@/types/configs";
import { useConfigArrayQuery } from "@/queris";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
type Props = {
  hideElement?:  {
    form_hide?: string[];
    list_hide?: string[];
  };
  isNewSection?: boolean;
  sectionName?: string;
  selectedSectionData?: PageSectionContent[];
  sectionId?: number;
}

import { z } from "zod";

const formSchema = z.object({
  title: z.string(),
  sub_title: z.string(),
  link: z.string(),
  img_src: z.string(),
  img_alt: z.string(), 
  content: z.string(),
});

// type ControlListElements = Record<string, ControlListElement>;
export type FormSchemaType = z.infer<typeof formSchema>;
export function AccordionSectionList(Props: Props) { 
  const location = useLocation();
  const pageData = location.state; 
  console.log("Props in AccordionSectionList:", Props);
  // const isEditMode = !!selectedSectionData; 
  const [pageId, setPageId] = useState<number>(Props.selectedSectionData && Props.selectedSectionData.length > 0 ? Props.selectedSectionData[0].page_id ?? 0 : 0);
  
  const [itemId, setItemId] = useState<number>(0);
  const queryClient = useQueryClient();
  console.log('section name: ',Props.sectionName);
  const [selectedHideElements, setSelectedHideElements] = useState<string[]>([]);
  useEffect(() => {
    if (pageData) {
      try {        
        setSelectedHideElements(Props?.hideElement?.form_hide ?? []) ;
        console.log('pageData in AddEditPageSection...', pageData);
        setPageId(pageData.id);
      } catch {
         console.log('pageData in AddEditPageSection...something wrong');
      }
    }
  }, [pageData]);
 const { data: configs } = useConfigArrayQuery();
  const { mutateAsync: createPageSection, isPending: isCreating } = useCreateListContentMutation();
  const { mutateAsync: updatePageSection, isPending: isUpdating } = useUpdateListContentMutation();
  const { mutateAsync: deletePageSectionItem, isPending: isDeleting } = useDeleteListContentMutation();
  const { data: cListElement } = useControlListElementsQuery();
  console.log('Control List Element...', cListElement,Props.isNewSection,Props);
  const [sectionImage, setSectionImage] = useState<Array<Pick<FileItem, 'name' | 'path' | 'url'>>>([]); 
  useEffect(
    () => {
      if (sectionImage && sectionImage.length)
      {
        form.setValue("img_src", sectionImage[0].path);
        console.log("page section image changed....", form.getValues().img_src);
      }
    }, [sectionImage]);
  
 const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      sub_title: "",
      link: configs?.data.link??"",
      img_src: "",
      img_alt: "",    
      content: "",
    },
 })
  const [crudStatus, setCrudStatus] = useState<string>("New");
 useEffect(() => {
   if (Props.isNewSection) {
     
      setCrudStatus("New");
      //console.log("Selected Section Data in AccordionSectionList:", selectedSectionId,Props.isNewSection,Props.selectedSectionData);
   }
   else {
     setCrudStatus("Updating");
    //  setSelectedSectionId(Props.selectedSectionData[0].section_id ?? 0);
   }
  }, [Props.isNewSection, Props.selectedSectionData]);
    const page = 1;
    const search = "";
    const page_size = 5; 
    const sort_by = "id";
    const sort_type = "desc";
  const handleFormSubmit = (data: PageSectionContent) => {
    
 // hardcoded for now
     data["page_id"] = pageId;
     data["id"] = itemId ?? "";
    //console.log("handleFormSubmit..", data,crudStatus, Props.selectedSectionData ? Props.selectedSectionData[0].section_id : null);
    
    if (crudStatus === "New") {      
      data["type"] = "list"; 
      data["section_id"] = Props.sectionId ?? 0;
      console.log("handleFormSubmit New..", data);
       toast.promise(
      createPageSection(data as PageSectionContent, {
        onSuccess: (data) => {
              if (data.data?.message) {
                toast.success(data.data?.message); 
                queryClient.invalidateQueries({ queryKey: ['page-section', { page, page_size, sort_by, sort_type, search, slug: pageData.slug }] });
                
              }
            },
            onError: (error) => {
              console.error("Error creating Page Section:", error);
            },
        // onSuccess: (response) => {
        //   console.log("Page Section created successfully:", response);

        // },
      })
    );
    } else {
      console.log("Updating Page Section:", data);
     toast.promise(
      updatePageSection(data as PageSectionContent, {
        onSuccess: (data) => {
              if (data.data?.message) {
                toast.success(data.data?.message); 
                queryClient.invalidateQueries({ queryKey: ['page-section', { page, page_size, sort_by, sort_type, search, slug: pageData.slug }] });
                // form.setValue("img_instruction", "");
                // form.setValue("title", "");
                // form.setValue("sub_title", "");
                // form.setValue("img_src", "");
                // form.setValue("img_alt", "");
                // form.setValue("img_width", 0);
                // form.setValue("img_height", 0);
                // form.setValue("content", "");
              }
            },
            onError: (error) => {
              console.error("Error creating Page Section:", error);
            },
        // onSuccess: (response) => {
        //   console.log("Page Section created successfully:", response);

        // },
      })
    );
    }
    
  };

  const [selectedCardId, setSelectedCardId] = useState<number | null>(null);
  const [selectedCardTitle, setSelectedCardTitle] = useState<string>("");
  
  const handleListItemClick = (item: PageSectionContent) => {
   setCrudStatus("Updating");
    // console.log("Clicked on item:", item?.hide_element?.form_hide, item);
    // setSelectedHideElements(item?.hide_element?.form_hide??[]);
    
    form.setValue("title", item.title ?? "");
    form.setValue("sub_title", item.sub_title ?? "");
    form.setValue("link", item.link ?? "");
    form.setValue("img_src", item.img_src ?? "");
    form.setValue("img_alt", item.img_alt ?? ""); 
   form.setValue("content", item.content ?? "");
   setSelectedCardId(item.id??0);
   setSelectedCardTitle(item.title??"");
  //  setSelectedItem(item.content);
  // setResetKey(prev => prev + 1);
  //  const [editorContent, setEditorContent] = useInputEditorState(
  //    selectedSectionData?.content ?? "",handleContentChange
  //  );
     
    console.log("hide elements...",selectedHideElements);
   
  //  handleContentChange(item.content ?? "");
  //  setEditorContent(item.content ?? "");
   setItemId(item.id ?? 0);  
   // setImageAlt(item.img_alt ?? "");
   if (item.img_src) {        
      setSectionImage([{ name: item.img_src.split('/').pop() ?? '', path: item.img_src, url: import.meta.env.VITE_FILE_MANAGER_IMAGE_PATH + item.img_src }])
  }
  };  
const imgAltValue = form.watch("img_alt");
  return (
    <>      
      <div className="flex flex-row justify-between gap-3">
        <div className="w-[60%]">
            <Card className="p-3"> 
              <CardTitle className="border-b-2 pb-3 text-amber-500 ">{selectedCardId?"Update "+selectedCardTitle: "New Entry"}</CardTitle> 
            
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-8"> 
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem className={selectedHideElements?.includes("title") ? "hidden" : ""}>
                      <FormLabel>
                        Title                     
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                  />
                  <FormField
                  control={form.control}
                  name="sub_title"
                  render={({ field }) => (
                    <FormItem className={selectedHideElements?.includes("sub_title") ? "hidden" : ""}>
                      <FormLabel>Sub Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Sub Title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                  />
                  <FormField
                  control={form.control}
                  name="link"
                  render={({ field }) => (
                    <FormItem className={selectedHideElements?.includes("link") ? "hidden" : ""}>
                      <FormLabel>Link</FormLabel>
                      <FormControl>
                        <Input placeholder="Link" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="img_src"
                  render={() => (
                    <FormItem className={`${selectedHideElements?.includes("image") ? "hidden" : ""}`}>
                      <FormLabel>Image <span className="inline-flex items-center rounded-md bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-800 inset-ring inset-ring-yellow-600/20">Instruction: {Props.sectionName ? configs?.data?.images?.[Props.sectionName]?.instruction:""}</span></FormLabel>
                      <FormControl>
                        <ImageCard
                          value={sectionImage}
                          onChange={setSectionImage}
                          imageAlt={imgAltValue || ""}
                          onAltChange={(val) => form.setValue("img_alt", val)}
                          parent="page"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                    control={form.control}
                    name="img_alt"
                    render={({ field }) => (
                      <FormItem className={`mt-3 ${selectedHideElements?.includes("image") ? "hidden" : ""}`}>
                        <FormLabel>Image Alt</FormLabel>
                        <FormControl>
                          <Input placeholder="Image Alt" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />                
                  <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem className={selectedHideElements?.includes("content") ? "hidden" : ""}>
                      <FormLabel>Content</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Content" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                  />
                  
                <Button type="submit" disabled={isUpdating || isCreating}><Save /> Submit</Button>
              </form>
              </Form>
            </Card>
        </div>
        <div className="w-[40%]">
          <h2 className="text-lg mb-2 text-center font-bold">Section List</h2>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-center">Title</TableHead>
                  <TableHead className="text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Props.selectedSectionData?.map((item: PageSectionContent) => (
                  <TableRow 
                    key={item.id}
                    className={`cursor-pointer ${
                      selectedCardId === item.id ? "bg-blue-50" : ""
                    }`}
                    onClick={() => handleListItemClick(item)}
                  >
                    <TableCell 
                      className={` text-center font-medium cursor-pointer ${selectedCardId === item.id ? "bg-amber-200" : ""
                        }`}>{item.title}</TableCell>
                    <TableCell className={` text-center cursor-pointer ${selectedCardId === item.id ? "bg-amber-200" : ""
                        }`}>
                      <ConfirmDeleteDialog
                        title="Are you sure?"
                        description="You want to delete this Section Item?"
                        triggerButton={
                          <Button variant="destructive" size="sm" className="ml-2">
                            <Trash2 />
                          </Button>
                        }
                        confirmButton={
                          <Button
                            variant="destructive"
                            onClick={() => {
                              if (typeof item.id === "number") {
                                toast.promise(
                                  deletePageSectionItem(item.id),
                                  {
                                    loading: "Deleting Section Item...",
                                    success: "Section Item deleted successfully!",
                                    error: "Error deleting Section Item.",
                                  }
                                )
                              } else {
                                toast.error("Invalid Section Item ID.");
                              }
                            }}
                            disabled={isDeleting}
                          >
                            {isDeleting && <Loader2 className="animate-spin" />}
                            {isDeleting ? "Loading..." : "Delete"}
                          </Button>
                        }
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
         
        </div>
      </div>
    </>
    
  );
}
