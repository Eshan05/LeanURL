import { Button } from "@components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@components/ui/dialog";

interface DeleteUrlDialogProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  urlToDelete: string;
  handleDelete: (url: string) => void;
}

export default function DeleteUrlDialog({ open, setOpen, urlToDelete, handleDelete }: DeleteUrlDialogProps) {
  const handleCancel = () => {
    setOpen(false);
  };

  const handleDeleteAndClose = () => {
    handleDelete(urlToDelete);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-[90%] sm:max-w-md" aria-describedby={undefined}>
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
