import { useState,useEffect} from "react";
import { Card } from "../ui/card";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useLocation } from "react-router-dom";
import type { PageSection } from "@/types/pages";
import ImageCard from "../image/image-card";
import { useUpdatePageSectionMutation } from "@/mutations";
import { toast } from "sonner";
import type { FileItem } from "@/types/file-manager";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
type Props = {
  selectedSectionData?: PageSection;
}
const formSchema = z.object({
  title: z.nullable(z.string().min(2, { message: "Title must be at least 2 characters." })),
  sub_title: z.nullable(z.string().min(2, { message: "Sub Title must be at least 2 characters." })),
  img_src: z.nullable(z.string().min(2, { message: "Image Src must be at least 2 characters." })),
  img_alt: z.nullable(z.string().min(2, { message: "Image Alt must be at least 2 characters." })),
  img_width: z.nullable(z.string()),
  img_height: z.nullable(z.string()),
  img_instruction: z.nullable(z.string().min(2, { message: "Image Instruction must be at least 2 characters." })),  
});
export type FormSchemaType = z.infer<typeof formSchema>;

 
export function AccordionSection({ selectedSectionData }: Props) { 
  const location = useLocation();
  const pageData = location.state; 
  const isEditMode = !!selectedSectionData; 
  const [pageId, setPageId] = useState<number>(selectedSectionData?.page_id ?? 0);


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
type FormData = z.infer<typeof formSchema> & {
  page_id?: number;
  id?: number;
  section_type?: string;
  section?: string;
};
const { mutateAsync: updatePageSection, isPending: isUpdating } = useUpdatePageSectionMutation()

  const [sectionImage, setSectionImage] = useState<Array<Pick<FileItem, 'name' | 'path' | 'url'>>>([]);
 
  useEffect(
    () => {
      if (sectionImage && sectionImage.length)
      {
        form.setValue("img_src", sectionImage[0].path);
        console.log("section image changed....", form.getValues().img_src);
      }
    }, [sectionImage]);
  useEffect(() => {
    if (isEditMode) {  
      console.log("selectedSectionData in AddEditPageSection...", selectedSectionData);  
      form.setValue("img_instruction", selectedSectionData?.img_instruction ?? "");
      form.setValue("title", selectedSectionData?.title ?? "");
      form.setValue("sub_title", selectedSectionData?.sub_title ?? "");
      form.setValue("img_src", selectedSectionData?.img_src ?? "");   
      form.setValue("img_alt", selectedSectionData?.img_alt ?? "");   
      form.setValue("img_width", String(selectedSectionData?.img_width ?? ""));   
      form.setValue("img_height", String(selectedSectionData?.img_height ?? "")); 
      if (selectedSectionData.img_src) {        
        setSectionImage([{ name: selectedSectionData.img_src.split('/').pop() ?? '', path: selectedSectionData.img_src, url: import.meta.env.VITE_FILE_MANAGER_IMAGE_PATH + selectedSectionData.img_src }])
      }
    }
}, [selectedSectionData,isEditMode]);  

const form = useForm<z.infer<typeof formSchema>>({
  resolver: zodResolver(formSchema),
  defaultValues: {
    title: "",
    sub_title: "",
    img_src: "",
    img_alt: "",
    img_width: "",
    img_height: "",
    img_instruction: "",
  },
});

const handleFormSubmit = (data: FormData) => {
  // Ensure page_id is always a number
  if (typeof pageId !== "number" || isNaN(pageId)) {
    toast.error("Invalid page ID.");
    return;
  }
  const submitData = {
    ...data,
    page_id: pageId,
    id: selectedSectionData?.id ?? undefined,
  };
  console.log("handleFormSubmit..", submitData, "fromData:", data, "selectedSectionData:", selectedSectionData  );

  toast.promise(
    updatePageSection(submitData as PageSection, {
      onSuccess: (data) => {
        if (data.data?.message) {
          toast.success(data.data?.message);                
          form.setValue("img_instruction", "");
          form.setValue("title", "");
          form.setValue("sub_title", "");
          form.setValue("img_src", "");
          form.setValue("img_alt", "");
          form.setValue("img_width", "");
          form.setValue("img_height", "");
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
};
 const imgAltValue = form.watch("img_alt");
  return (
    <Card className="p-6">     
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-8"> 
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Title" {...field} value={field.value ?? ""} />
              </FormControl>
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
                <Input placeholder="Sub Title" {...field} value={field.value ?? ""} />
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
                <Input placeholder="Image Alt" {...field} value={field.value ?? ""} />
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
                <Input placeholder="Image Width" {...field} value={field.value ?? ""} />
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
                <Input placeholder="Image Height" {...field} value={field.value ?? ""} />
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
                <Input placeholder="Image Instruction" {...field} value={field.value ?? ""} />
              </FormControl>              
              <FormMessage />
            </FormItem>
          )}
          />          
        <Button type="submit" disabled={isUpdating}>Submit</Button>
      </form>
    </Form>
    </Card>
  );
}
