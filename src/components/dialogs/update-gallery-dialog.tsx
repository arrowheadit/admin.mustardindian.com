import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { LoaderCircle, X } from "lucide-react";
import { useCreateGalleryMutation,useUpdateGalleryMutation } from "@/mutations";
import { toast } from "sonner";
import { useState,useEffect } from "react";
import { Dialog, DialogClose, DialogOverlay, DialogTitle } from "@/components/ui/dialog";
import { useConfigArrayQuery } from "@/queris";
import { Switch } from "@/components/ui/switch";
import {Save}  from "lucide-react";
// import TextareaAutosize from "react-textarea-autosize"
// import { useQueryClient } from '@tanstack/react-query'

import { Card,
        // CardAction,
        // CardContent,
        // CardDescription,
        // CardFooter,
        // CardHeader,
        // CardTitle,
} from "../ui/card";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Input } from "../ui/input";
import { Textarea } from "@/components/ui/textarea"
// import { useLocation } from "react-router-dom";
import type { GalleryItem } from "@/types/galleries";
import ImageCard from "../image/image-card";


import type { FileItem } from "@/types/file-manager";
// import ConfirmDeleteDialog from "@/components/dialogs/pop-confirm-dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

import { z } from "zod";
const formSchema = z.object({
  title: z.string(),
  name: z.string(),
  start_date: z.string(),
  end_date: z.string(),
  sub_title: z.string(),
  link: z.string(),
  img_src: z.string(),
  img_alt: z.string(),  
  content: z.string(),
  status:z.string(),
});

export type FormSchemaType = z.infer<typeof formSchema>;
export default function UpdateGalleryDialog({
  dialogController,
  editAbleGallery,
}: {
  dialogController: [boolean, (open: boolean) => void]
  editAbleGallery?: GalleryItem
  }) {
  const { mutateAsync: createGallery, isPending: isCreating } = useCreateGalleryMutation();
  const { mutateAsync: updateGallery, isPending: isUpdating } = useUpdateGalleryMutation();
  const { data: configs } = useConfigArrayQuery();
  // const { mutateAsync: deletePageSectionItem, isPending: isDeleting } = useDeleteListContentMutation();
  const [open, setOpen] = dialogController;
  console.log('editAbleGallery', editAbleGallery);
  // const queryClient = useQueryClient();
  const [crudStatus, setCrudStatus] = useState<string>("New");
 const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      name: "",
      start_date: "",
      end_date: "",
      sub_title: "",
      link: configs?.data.link??"",
      img_src: "",
      img_alt: "",      
      content: "",
      status:"active"
    },
 })
  const [sectionImage, setSectionImage] = useState<Array<Pick<FileItem, 'name' | 'path' | 'url'>>>([]); 
    useEffect(
      () => {
        if (sectionImage && sectionImage.length)
        {
          form.setValue("img_src", sectionImage[0].path);
          console.log("page section image changed....", form.getValues().img_src);
        }
      }, [sectionImage]);
  useEffect(
    () => {
      if (editAbleGallery) {
        setCrudStatus('Old');
      }      
      if (editAbleGallery && editAbleGallery.name && editAbleGallery.name.length)
        {
          form.setValue("name", editAbleGallery.name);
      }      
      if (editAbleGallery && editAbleGallery.title && editAbleGallery.title.length)
        {
          form.setValue("title", editAbleGallery.title);
      }
      if (editAbleGallery && editAbleGallery.sub_title && editAbleGallery.sub_title.length)
        {
          form.setValue("sub_title", editAbleGallery.sub_title);
      }
      if (editAbleGallery && editAbleGallery.link && editAbleGallery.link.length)
        {
          form.setValue("link", editAbleGallery.link);
      }
      if (editAbleGallery && editAbleGallery.img_src && editAbleGallery.img_src.length)
        {
        form.setValue("img_src", editAbleGallery.img_src);
        setSectionImage([{ name: editAbleGallery.img_src.split('/').pop() ?? '', path: editAbleGallery.img_src, url: import.meta.env.VITE_FILE_MANAGER_IMAGE_PATH + editAbleGallery.img_src }])
        }
        if (editAbleGallery && editAbleGallery.img_alt && editAbleGallery.img_alt.length)
        {
          form.setValue("img_alt", editAbleGallery.img_alt);          
      }      
      
      if (editAbleGallery && editAbleGallery.content && editAbleGallery.content.length)
        {
          form.setValue("content", editAbleGallery.content);
      }
       if (editAbleGallery && editAbleGallery.status && editAbleGallery.status.length)
        {
          form.setValue("status", editAbleGallery.status);
        }
      }, [editAbleGallery]);
  
//  const page = 1;
//     const search = "";
//     const page_size = 5; 
//     const sort_by = "id";
//     const sort_type = "desc";
  const handleFormSubmit = (data: GalleryItem) => {   
    if (crudStatus === "New") {    
      console.log("handleFormSubmit New..", data);
       toast.promise(
      createGallery(data as GalleryItem, {
        onSuccess: (data) => {
          if (data.data?.message) {
            console.log("Gallery Created Successfully");
                toast.success(data.data?.message); 
                // queryClient.invalidateQueries({ queryKey: ['page-section', { page, page_size, sort_by, sort_type, search, slug: pageData.slug }] });
                
              }
            },
            onError: (error) => {
              console.error("Error creating Gallery:", error);
            },
        // onSuccess: (response) => {
        //   console.log("Page Section created successfully:", response);

        // },
      })
    );
    } else {
      console.log("Updating Page Section:", data);
      if (editAbleGallery && editAbleGallery.id )
        {
          data["id"]= editAbleGallery.id;
      }
     toast.promise(
      updateGallery(data as GalleryItem, {
        onSuccess: (data) => {
              if (data.data?.message) {
                toast.success(data.data?.message); 
                console.log("Gallerys updated");
                // queryClient.invalidateQueries({ queryKey: ['page-section', { page, page_size, sort_by, sort_type, search, slug: pageData.slug }] });
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
              console.error("Error Updating Gallery:", error);
            },
        // onSuccess: (response) => {
        //   console.log("Page Section created successfully:", response);

        // },
      })
    );
    }
    
  };
  const imgAltValue = form.watch("img_alt");
  const statusValue = form.watch("status"); // reactive!
  return (
    <Dialog open={open} onOpenChange={(isOpen) => setOpen(isOpen)}>
      <DialogOverlay className="fixed inset-0 bg-black/50 z-50" onClick={() => setOpen(false)}/>
      <div
       className="fixed top-10 left-1/2 transform -translate-x-1/2 
               bg-white rounded-xl p-6 max-w-3xl w-full z-50 
               max-h-[calc(100vh-5rem)] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <DialogTitle className="text-xl font-semibold">{crudStatus === "New" ? "New Gallery" : "Update Gallery"}</DialogTitle>

        <div className="w-[100%] mt-4">
            <Card className="p-3"> 
              {/* <CardTitle className="border-b-2 pb-3 text-amber-500 ">{selectedCardId?"Update "+selectedCardTitle: "New Entry"}</CardTitle>  */}
            
              <Form {...form}>
              <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-8"> 
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
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
                    <FormItem>
                      <FormLabel>Sub Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Sub Title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                  />
                 <div className="flex flex-row justify-between">
                  <div className="w-[45%]">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Name                     
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="Name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="w-[45%]">
                    <FormField
                      control={form.control}
                      name="link"
                      render={({ field }) => (
                        <FormItem >
                          <FormLabel>Link</FormLabel>
                          <FormControl>
                            <Input placeholder="Link" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                </div>
                  
                  
                <div className={`flex gap-3`} >
                  <div className="flex-2/6 ">
                    <FormField
                  control={form.control}
                  name="img_src"
                  render={() => (
                    <FormItem>
                      <FormLabel>Image<span className="inline-flex items-center rounded-md bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-800 inset-ring inset-ring-yellow-600/20">Instruction: {configs?.data?.images?.['Gallery Section']?.instruction}</span></FormLabel>
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
                  </div>
                  <div className="flex-auto space-y-4">                    
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
                  </div>                  
                </div>
                  
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
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <Label htmlFor="name" className="block mb-2 font-medium">Status</Label>              
                  </div>
                  <Switch
                      className="cursor-pointer"
                      checked={statusValue === "active"}
                      onCheckedChange={(checked: boolean) =>
                        form.setValue("status", checked ? "active" : "inactive")
                      }
                      disabled={isCreating || isUpdating}
                    />
                  </div>
                  
                <Button type="submit" ><Save /> Submit</Button>
              </form>
              </Form>
            </Card>
        </div>

        <DialogClose asChild>
          <Button
            variant={"ghost"}
            onClick={() => setOpen(false)}
            className="absolute top-4 right-4 cursor-pointer text-gray-500 hover:text-gray-700"
            disabled={isCreating || isUpdating}
          >
            {isCreating || isUpdating ? <LoaderCircle className="animate-spin"/> : <X />}
          </Button>
        </DialogClose>
      </div>
    </Dialog>
  );
}
