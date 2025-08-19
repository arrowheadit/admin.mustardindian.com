import { useState,useEffect,useCallback } from "react";
import { Card } from "../ui/card";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useLocation } from "react-router-dom";
import type { PageSectionContent } from "@/types/pages";
import ImageCard from "../image/image-card";
import { useUpdatePageSectionContentMutation } from "@/mutations";
import { toast } from "sonner";
import type { FileItem } from "@/types/file-manager";
import ReachTextEditor from "@/components/editor/reach-text-editor";
import { useInputEditorState } from "@/hooks/useInputEditorState";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
type Props = {
  selectedSectionData?: PageSectionContent;
}

const formSchema = z.object({
  title: z.nullable(z.string()),
  sub_title: z.nullable(z.string()),
  img_src: z.nullable(z.string()),
  img_alt: z.nullable(z.string()),
  img_width: z.nullable(z.string()),
  img_height: z.nullable(z.string()),
  img_instruction: z.string().nullish(), 
  content: z.string().nullish(),
});
export type FormSchemaType = z.infer<typeof formSchema>;

 
export function AccordionSectionContent({ selectedSectionData }: Props) { 
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
  type?: string;
  section_id?: number;
};
const { mutateAsync: updatePageSection, isPending: isUpdating } = useUpdatePageSectionContentMutation()
  const [sectionImage, setSectionImage] = useState<Array<Pick<FileItem, 'name' | 'path' | 'url'>>>([]);
  const handleContentChange = useCallback((html: string) => {
    form.setValue("content", html);
  }, []);
  const [editorContent, setEditorContent] = useInputEditorState(
  selectedSectionData?.content ?? "",handleContentChange
);
  
 
  useEffect(
    () => {
      if (sectionImage && sectionImage.length)
      {
        form.setValue("img_src", sectionImage[0].path);
        console.log("page section image changed....", form.getValues().img_src);
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
      form.setValue("content", selectedSectionData?.content ?? "");      
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
      content: "",
    },
 })
// const form = useForm<{
//   title: string | null;
//   sub_title: string | null;
//   img_src: string | null;
//   img_alt: string | null;
//   img_width: string | null;
//   img_height: string | null;
//   img_instruction: string | null;
//   content: string | null;
//   section?: string;
//   type?: string;
// }>({
//   resolver: zodResolver(formSchema),
//   defaultValues: {
//     title: "",
//     sub_title: "",
//     img_src: "",
//     img_alt: "",
//     img_width: "",
//     img_height: "",
//     img_instruction: "",
//     content: "",
//     section: "",
//     type: "content",
//   },
// });

const handleFormSubmit = (data: FormData) => {
  // Ensure page_id is always a number
  if (typeof pageId !== "number" || isNaN(pageId)) {
    toast.error("Invalid page ID.");
    return;
  }
  const submitData = {
    ...data,
    page_id: pageId,
    section_id: selectedSectionData?.section_id ?? 0,
    id: selectedSectionData?.id ?? undefined,
  };
  console.log("handleFormSubmit..", submitData);

  toast.promise(
    updatePageSection(submitData as PageSectionContent, {
      onSuccess: (data) => {
        if (data.data?.message) {
          toast.success(data.data?.message);                
          // form.setValue("img_instruction", "");
          // form.setValue("title", "");
          // form.setValue("sub_title", "");
          // form.setValue("img_src", "");
          // form.setValue("img_alt", "");
          // form.setValue("img_width", "");
          // form.setValue("img_height", "");
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
                <Input placeholder="Sub Title" {...field} value={field.value ?? ""} />
              </FormControl>
              {/* <FormDescription>
                This is Section Sub Title.
              </FormDescription> */}
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
                {/* <Input placeholder="Image" {...field} /> */}
                <ImageCard
                  value={sectionImage}
                  onChange={setSectionImage}
                  imageAlt={imgAltValue || ""}
                  onAltChange={(val) => form.setValue("img_alt", val)}
                  parent="page"
                />
              </FormControl>
              {/* <FormDescription>
                This is Section Image.
              </FormDescription> */}
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
              {/* <FormDescription>
                This is Section Image Alt.
              </FormDescription> */}
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
              {/* <FormDescription>
                This is Section Image Width.
              </FormDescription> */}
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
              {/* <FormDescription>
                This is Section Image Height.
              </FormDescription> */}
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
                 <Input placeholder="Image Height" {...field} value={field.value ?? ""} />
              </FormControl>
              {/* <FormDescription>
                This is Section Image Instruction.
              </FormDescription> */}
              <FormMessage />
            </FormItem>
          )}
          />
          <FormField
          control={form.control}
          name="content"
          render={() => (
            <FormItem>
              <FormLabel>Content</FormLabel>
              <FormControl>
                {/* <Input placeholder="Content" {...field} /> */}
                <ReachTextEditor editorStateController={[editorContent, setEditorContent]} />
              </FormControl>
              {/* <FormDescription>
                This is Section Content.
              </FormDescription> */}
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
