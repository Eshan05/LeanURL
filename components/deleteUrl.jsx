import { Trash2 } from "lucide-react";
import { Button } from "@components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@components/ui/dialog";

export function DeleteUrlDialog({ open, setOpen, urlToDelete, handleDelete }) {
  const handleCancel = () => {
    setOpen(false);
  };

  const handleDeleteAndClose = () => {
    handleDelete(urlToDelete); // Perform the delete action
    setOpen(false); // Close the dialog after deletion
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-[90%] sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Confirm Deletion</DialogTitle>
          <p>Are you sure you want to delete this URL? This action cannot be undone.</p>
        </DialogHeader>
        <DialogFooter className="gap-2 mx-8 sm:ml-0 sm:justify-start">
          <Button
            type="button"
            variant="outline"
            onClick={handleDeleteAndClose}
          >
            <span className="flex items-center">
              Delete
            </span>
          </Button>

          <DialogClose asChild>
            <Button type="button" variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
          </DialogClose>
        </DialogFooter>

      </DialogContent>
    </Dialog>
  );
}
