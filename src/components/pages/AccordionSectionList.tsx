import { useState, useEffect } from "react";
import {  useQueryClient } from '@tanstack/react-query'
import { Card } from "../ui/card";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Textarea } from "@/components/ui/textarea"
import { useLocation } from "react-router-dom";
import type { PageSectionContent } from "@/types/pages";
import ImageCard from "../image/image-card";
import { useCreateListContentMutation,useUpdateListContentMutation,useDeleteListContentMutation } from "@/mutations";
import { toast } from "sonner";
import type { FileItem } from "@/types/file-manager";
import ConfirmDeleteDialog from "@/components/dialogs/pop-confirm-dialog";
import { Trash2, Loader2 } from "lucide-react";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
type Props = {
  isNewSection?: boolean;
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
  img_width: z.string(),
  img_height: z.string(),
  img_instruction: z.string(),
  content: z.string(),
});
export type FormSchemaType = z.infer<typeof formSchema>;
export function AccordionSectionList(Props: Props) { 
  const location = useLocation();
  const pageData = location.state; 
  console.log("Props in AccordionSectionList:", Props);
  // const isEditMode = !!selectedSectionData; 
  const [pageId, setPageId] = useState<number>(Props.selectedSectionData && Props.selectedSectionData.length > 0 ? Props.selectedSectionData[0].page_id ?? 0 : 0);
  const [itemId, setItemId] = useState<number>(0);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (pageData) {
      try {
        console.log('pageData in AddEditPageSection...', pageData);
        setPageId(pageData.id);
      } catch {
         console.log('pageData in AddEditPageSection...something wrong');
      }
    }
  }, [pageData]);

  const { mutateAsync: createPageSection, isPending: isCreating } = useCreateListContentMutation();
  const { mutateAsync: updatePageSection, isPending: isUpdating } = useUpdateListContentMutation();
  const { mutateAsync: deletePageSectionItem, isPending: isDeleting } = useDeleteListContentMutation();
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
      link: "",
      img_src: "",
      img_alt: "",
      img_width: "",
      img_height: "",
      img_instruction: "",
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
  const handleListItemClick = (item: PageSectionContent) => {
   setCrudStatus("Updating");
    console.log("Clicked on item:", item);
    form.setValue("title", item.title ?? "");
    form.setValue("sub_title", item.sub_title ?? "");
    form.setValue("link", item.link ?? "");
    form.setValue("img_src", item.img_src ?? "");
    form.setValue("img_alt", item.img_alt ?? "");
    form.setValue("img_width", String(item.img_width ?? ""));
    form.setValue("img_height", String(item.img_height ?? ""));
   form.setValue("img_instruction", item.img_instruction ?? "");
   form.setValue("content", item.content ?? "");
   setSelectedCardId(item.id??0);
  //  setSelectedItem(item.content);
  // setResetKey(prev => prev + 1);
  //  const [editorContent, setEditorContent] = useInputEditorState(
  //    selectedSectionData?.content ?? "",handleContentChange
  //  );
     

   
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
      <div className="text-center  p-1 ms-auto w-1/3 bg-amber-500 text-2xl font-bold text-white"> {crudStatus==="New" ? "Creating New List" : "Updating List"} </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="col-span-1 md:col-span-2">
         <Card className="p-6">     
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-8"> 
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Title
                      {/* <Badge variant={crudStatus === "New" ? "default" : "destructive"} className="p-1 ms-2">
                        {crudStatus}
                      </Badge> */}
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Title" {...field} />
                    </FormControl>
                    {/* <FormDescription>
                      This is Section Title.
                    </FormDescription> */}
                    <FormMessage />
                  </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="sub_title"
                render={({ field }) => (
                  <FormItem>
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
                  <FormItem>
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
                  <FormItem>
                    <FormLabel>Image</FormLabel>
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
                  <FormItem>
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
                name="img_width"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image Width</FormLabel>
                    <FormControl>
                      <Input placeholder="Image Width" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="img_height"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image Height</FormLabel>
                    <FormControl>
                      <Input placeholder="Image Height" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="img_instruction"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image Instruction</FormLabel>
                    <FormControl>
                      <Input placeholder="Image Instruction" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Content</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Content" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
                />
                
              <Button type="submit" disabled={isUpdating || isCreating}>Submit</Button>
            </form>
            </Form>
          </Card>
      </div>
      <div className="col-span-1 md:col-span-1">
        <h2 className="text-lg mb-2 text-center font-bold">Section List</h2>
        {Props.selectedSectionData && Props.selectedSectionData.map((item: PageSectionContent) => (
          <Card key={item.id} className={`mb-4 p-4 cursor-pointer border 
          ${selectedCardId === item.id
            ? "border-blue-500 bg-blue-50"
            : "border-gray-300"
          }`} onClick={() => {
            handleListItemClick(item);
            }}>
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold text-center">{item.title}</h4>
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
            {isDeleting && <Loader2 className="animate-spin"/>}
            {isDeleting ? "Loading..." : "Delete"}
          </Button>
        }
      />
              {/* <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="cursor-pointer"
                  onClick={() => removeSingleItem(item.id)}                  
                >
                  <X className="h-4 w-4" />
                </Button> */}
            </div>
            
            {/* <p className="text-sm">{item.sub_title}</p> */}
            <img src={import.meta.env.VITE_FILE_MANAGER_IMAGE_PATH + item.img_src} alt={item.img_alt} className="w-[100px] h-[100px] block mx-auto" />
            
          </Card>
        ))}
      </div>
    </div>
     
    </>
    
  );
}
