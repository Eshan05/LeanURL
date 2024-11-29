// @ts-nocheck
// I hate strings and date
import { useState, useEffect } from "react";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from "@components/ui/dialog";
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { Save } from "lucide-react";
import { URLDocument, URLWithDuplicateCount } from "@/types/types";

type EditUrlDialogProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  urlToEdit: URLDocument | null; // Fuck this
  handleEdit: (id: string, updatedFields: { shortenUrl: string, expirationDate?: Date, scheduledDate?: Date | null }) => void;
};

export function EditUrlDialog({ open, setOpen, urlToEdit, handleEdit }: EditUrlDialogProps) {
  const [newShortenUrl, setNewShortenUrl] = useState<string>(urlToEdit?.shortenUrl || "");
  const [newExpirationDate, setNewExpirationDate] = useState("");
  const [newScheduledDate, setNewScheduledDate] = useState("");

  useEffect(() => {
    if (urlToEdit?.expirationDate) {
      setNewExpirationDate(formatDateForInput(urlToEdit.expirationDate) || "");
    }
    if (urlToEdit?.scheduledDate) {
      setNewScheduledDate(formatDateForInput(urlToEdit.scheduledDate));
    }
    if (urlToEdit?.shortenUrl) {
      setNewShortenUrl(urlToEdit.shortenUrl);
    }
  }, [urlToEdit]);

  const formatIncomingDate = (date: Date): string => {
    if (!date) return "";
    const localDate = new Date(date);

    // Create a string formatted as 'YYYY-MM-DDTHH:MM'
    const year = localDate.getFullYear();
    const month = String(localDate.getMonth() + 1).padStart(2, "0"); // months are 0-based
    const day = String(localDate.getDate()).padStart(2, "0");
    const hours = String(localDate.getHours()).padStart(2, "0");
    const minutes = String(localDate.getMinutes()).padStart(2, "0");

    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const formatDateForInput = (date: Date) => {
    if (!date) return "";
    const localDate = new Date(date);
    // Adjust to local timezone using toLocaleString and format it back to input format
    return localDate.toLocaleString('sv-SE', {
      timeZoneName: 'short',
      hour12: false,
    }); // Convert to "YYYY-MM-DDTHH:MM" format
  };

  const formatDateToComparableString = (date: Date | undefined): string | undefined => {
    if (!date) return undefined;
    const localDate = new Date(date);
    return localDate.toISOString().slice(0, 16);  // Formats to 'YYYY-MM-DDTHH:MM'
  };

  const handleCancel = () => {
    setOpen(false);
  };

  const handleSave = () => {
    if (!urlToEdit || !urlToEdit._id) {
      console.error('Missing URL ID');
      return;
    }

    const updatedFields = {
      shortenUrl: typeof newShortenUrl === 'string' ? newShortenUrl.trim() : '',
      expirationDate: newExpirationDate ? new Date(newExpirationDate) : undefined,
      scheduledDate: newScheduledDate ? new Date(newScheduledDate) : null,
    };

    if (
      newShortenUrl !== urlToEdit.shortenUrl ||
      newExpirationDate !== urlToEdit.expirationDate ||
      newScheduledDate !== urlToEdit.scheduledDate
    ) {
      handleEdit(urlToEdit._id, updatedFields);
    }
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-[90%] sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Shortened URL</DialogTitle>
          <DialogDescription>
            Modify the shortened URL and expiration/scheduled dates. Make sure shortened URL field isn&apos;t empty
          </DialogDescription>
        </DialogHeader>

        <div className="my-2">
          <label htmlFor="shortenUrl" className="block text-sm font-medium text-gray-700">Shortened URL</label>
          <Input
            type="text"
            id="shortenUrl"
            value={newShortenUrl}
            onChange={(e) => setNewShortenUrl(e.target.value)}
            className="w-full p-2 mt-0.5 border rounded-md focus-visible:ring-0 focus-visible:ring-offset-0"
            placeholder="Enter new shortened URL"
          />

          <label htmlFor="expirationDate" className="block mt-2 text-sm font-medium text-gray-700">Expiration Date</label>
          <Input
            type="datetime-local"
            id="expirationDate"
            value={formatIncomingDate(urlToEdit?.expirationDate) || newExpirationDate}
            onChange={(e) => setNewExpirationDate(e.target.value)}
            className="w-full p-2 mt-0.5 border rounded-md focus-visible:ring-0 focus-visible:ring-offset-0"
          />

          <label htmlFor="scheduledDate" className="block mt-2 text-sm font-medium text-gray-700">Scheduled Date</label>
          <Input
            type="datetime-local"
            id="scheduledDate"
            value={formatIncomingDate(urlToEdit?.scheduledDate) || newScheduledDate}
            onChange={(e) => setNewScheduledDate(e.target.value)}
            className="w-full p-2 mt-0.5 border rounded-md focus-visible:ring-0 focus-visible:ring-offset-0"
          />
        </div>

        <DialogFooter className="gap-2 mx-8 sm:ml-0 sm:justify-start">
          <DialogClose asChild>
            <Button type="button" variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
          </DialogClose>
          <Button type="button" onClick={handleSave} variant="outline" className="flex items-center gap-2">
            <Save className="w-4 h-4" /> Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
