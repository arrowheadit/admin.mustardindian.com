import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { LoaderCircle, X } from "lucide-react";
import { useCreateConfigMutation,useUpdateConfigMutation } from "@/mutations";
import { toast } from "sonner";
import { useState } from "react";
import { Dialog, DialogClose, DialogOverlay, DialogTitle } from "@/components/ui/dialog";
import type { ConfigItem } from "@/types/configs";
import { Switch } from "@/components/ui/switch";
import TextareaAutosize from "react-textarea-autosize"
export default function UpdateConfigDialog({
  dialogController,
  editAbleConfig,
}: {
  dialogController: [boolean, (open: boolean) => void]
  editAbleConfig?: ConfigItem
}) {
  const [open, setOpen] = dialogController;
  const [formState, setFormState] = useState<ConfigItem>({
    id: Number(editAbleConfig?.id) || 0,
    property: editAbleConfig?.property || "",
    value: editAbleConfig?.value || "",
    slug: editAbleConfig?.slug || "",
    status: editAbleConfig?.status || "active",
  });
   // Handle input changes
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setFormState({
        ...formState,
        [name]: value,
      });
      // Clear error when field is edited
      if (errors[name as keyof ConfigItem]) {
        setErrors({
          ...errors,
          [name]: undefined,
        });
      }
    };
const [errors, setErrors] = useState<Partial<Record<keyof ConfigItem, string>>>({});
  const { mutateAsync: createConfig, isPending: isCreating } = useCreateConfigMutation()
  const { mutateAsync: updateConfig, isPending: isUpdating } = useUpdateConfigMutation()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("formState in config:", formState);
    toast.promise(
      editAbleConfig
        ? updateConfig(
          {
            id: editAbleConfig.id,
            property: formState.property,
            value: formState.value,
            status: formState.status,            
          }, {
            onSuccess: () => {
            setOpen(false);
            },
            onError: (error) => {
              console.error("Error updating Config:", error);
            },
          })
        :
        createConfig({
            property: formState.property,
            value: formState.value,
            status: formState.status,  
        }, {
        onSuccess: () => {
          setOpen(false);
        },
        onError: (error) => {
          console.error("Error creating Config:", error);
        },
      }),
      {
        loading: editAbleConfig
        ? "Updating Config..."
        : "Creating Config...",
        success: editAbleConfig
        ? "Config updated successfully!"
        : "Config created successfully!",
        error: editAbleConfig
        ? "Error updating Config"
        : "Error creating Config",
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
        <DialogTitle className="text-xl font-semibold">Update Configs</DialogTitle>

        <form onSubmit={handleSubmit} className="mt-4">         
            
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <Label htmlFor="name" className="block mb-2 font-medium">{formState.property}</Label>              
            </div>
            <TextareaAutosize
              placeholder="Type here..." value={formState.value} onChange={handleInputChange} name="value"
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              minRows={2}
              maxRows={10}
            />
            
            {/* <Input
              disabled={isCreating || isUpdating}
              id="title"
              name="title"
              type="text"
              className="w-full"
              required
              value={formState.title}
              onChange={handleInputChange}
            /> */}
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
              {editAbleConfig ? "Update" : "Create"}
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
