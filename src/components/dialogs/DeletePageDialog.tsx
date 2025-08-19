import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import ConfirmDeleteDialog from "./pop-confirm-dialog";
import type { PageItem } from "@/types/pages";
import { toast } from "sonner";
import { useState } from "react";
import { useDeletePageMutation } from "@/mutations";

type DeletePageDialogProps = {
  page: PageItem | null;
  onClose: () => void;
};

export default function DeletePageDialog({ page, onClose }: DeletePageDialogProps) {
  const { mutateAsync: deletePage } = useDeletePageMutation();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!page) return;

    setLoading(true);
    try {
      await toast.promise(deletePage(page.slug), {
        loading: "Deleting Page...",
        success: "Page Deleted successfully!",
        error: "Error Deleting Page.",
      });
      onClose(); // Notify parent to close dialog and refetch if necessary
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (!page) return null;

  return (
    <ConfirmDeleteDialog
      open={!!page}
      onOpenChange={(isOpen) => {
        if (!isOpen) onClose();
      }}
      title="Are you sure?"
      description={`You want to delete "${page.title}"`}
      confirmButton={
        <Button
          variant="destructive"
          onClick={handleDelete}
          disabled={loading}
        >
          {loading && <Loader2 className="animate-spin mr-2" />}
          {loading ? "Deleting..." : "Delete"}
        </Button>
      }
    />
  );
}