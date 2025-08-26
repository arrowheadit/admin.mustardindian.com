import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LoaderCircle, X } from "lucide-react";
import { useCreatePageMutation,useUpdatePageMutation } from "@/mutations";
import { toast } from "sonner";
import { useState } from "react";
import { Dialog, DialogClose, DialogOverlay, DialogTitle } from "@/components/ui/dialog";
import type { PageItem,CreatePageItem } from "@/types/pages";
import { Switch } from "@/components/ui/switch";
import {Save}  from "lucide-react";
export default function AddPageDialog({
  dialogController,
  editAblePage,
}: {
  dialogController: [boolean, (open: boolean) => void]
  editAblePage?: PageItem
}) {
  const [open, setOpen] = dialogController;
  const [formState, setFormState] = useState<PageItem>({
    id: Number(editAblePage?.id) || 0,
    title: editAblePage?.title || "",
    slug: editAblePage?.slug || "",
    status:editAblePage?.status || "active",
  });
   // Handle input changes
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setFormState({
        ...formState,
        [name]: value,
      });
      // Clear error when field is edited
      if (errors[name as keyof CreatePageItem]) {
        setErrors({
          ...errors,
          [name]: undefined,
        });
      }
    };
const [errors, setErrors] = useState<Partial<Record<keyof CreatePageItem, string>>>({});
  const { mutateAsync: createPage, isPending: isCreating } = useCreatePageMutation()
  const { mutateAsync: updatePage, isPending: isUpdating } = useUpdatePageMutation()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    toast.promise(
      editAblePage
        ? updatePage(
          {
            id: editAblePage.id,
            title: formState.title,
            slug: formState.slug,
            status: formState.status,            
          }, {
            onSuccess: () => {
            setOpen(false);
            },
            onError: (error) => {
              console.error("Error updating Page:", error);
            },
          })
        :
        createPage({
            title: formState.title,
            slug: formState.slug,
            status: formState.status,  
        }, {
        onSuccess: () => {
          setOpen(false);
        },
        onError: (error) => {
          console.error("Error creating Page:", error);
        },
      }),
      {
        loading: editAblePage
        ? "Updating Page..."
        : "Creating Page...",
        success: editAblePage
        ? "Page updated successfully!"
        : "Page created successfully!",
        error: editAblePage
        ? "Error updating Page"
        : "Error creating Page",
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => setOpen(isOpen)}>
      <DialogOverlay className="fixed inset-0 bg-black/50 z-50" onClick={() => setOpen(false)}/>
      <div
       className="fixed top-10 left-1/2 transform -translate-x-1/2 
               bg-white rounded-xl p-6 max-w-3xl w-full z-50 
               max-h-[calc(100vh-5rem)] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <DialogTitle className="text-xl font-semibold">Update Page</DialogTitle>

        <form onSubmit={handleSubmit} className="mt-4">         
            
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <Label htmlFor="name" className="block mb-2 font-medium">Title</Label>              
            </div>
            <Input
              disabled={isCreating || isUpdating}
              id="title"
              name="title"
              type="text"
              className="w-full"
              required
              value={formState.title}
              onChange={handleInputChange}
            />
          </div>          
           <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <Label htmlFor="name" className="block mb-2 font-medium">Status</Label>              
            </div>
            <Switch
                  className="cursor-pointer"
                  checked={formState.status=="active"?true:false} 
                  onCheckedChange={(checked: boolean) => setFormState({ ...formState, status: checked?"active":"inactive" })} 
                  disabled={isCreating || isUpdating} 
                />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="secondary" onClick={() => setOpen(false)} disabled={isCreating || isUpdating}>
              {isCreating || isUpdating && <LoaderCircle className="animate-spin"/>}
              cancel
            </Button>
            <Button type="submit" disabled={isCreating || isUpdating}>
              {isCreating || isUpdating && <LoaderCircle className="animate-spin"/>}
              <Save /> {editAblePage ? "Update" : "Create"}
            </Button>
          </div>
        </form>

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
