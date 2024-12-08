import { useState } from "react";
import { ImFire } from "react-icons/im";
import { MdRestore } from "react-icons/md";
import { PiStackDuotone } from "react-icons/pi";
import { toast } from "sonner";
import { Button } from "@components/ui/button";

type URL = {
  _id: string;
  expirationDate?: Date;
  scheduledDate: Date | null;
  duplicateCount: number;
  deletedAt?: Date | null;
};

interface URLStatusProps {
  url: URL;
}

export const URLStatus = ({ url }: URLStatusProps) => {
  const [isRestoring, setIsRestoring] = useState(false);
  const [isPermanentlyDeleting, setIsPermanentlyDeleting] = useState(false);
  const [restoreError, setRestoreError] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  let expirationStatus;
  if (url.expirationDate) {
    const expirationDate = new Date(url.expirationDate);
    if (expirationDate < new Date()) {
      expirationStatus = (
        <span className='px-2 py-.5 font-bold rounded-lg bg-red-400/20 small-caps text-red-500/80'>Expired</span>
      );
    } else {
      expirationStatus = (
        <span><b>Expiration: </b> <span className="text-muted-foreground">
          {isNaN(expirationDate.getTime()) ? "Not set" : expirationDate.toLocaleString()}
        </span></span>
      );
    }
  } else { expirationStatus = <span><b>Expiration: </b> <span className="text-muted-foreground">Not set</span></span>; }

  const handleRestore = async () => {
    if (!url.deletedAt) return;
    setIsRestoring(true);
    try {
      const response = await fetch(`/api/analytics?id=${url._id}&action=restore`, { method: 'POST' });
      if (response.ok) {
        setIsRestoring(false);
        toast.success('URL restored successfully!');
      } else {
        const error = await response.json();
        setRestoreError(error.message || 'Error restoring URL');
        setIsRestoring(false);
      }
    } catch (error) {
      console.error('Error during restore:', error);
      setRestoreError('An unexpected error occurred. Please try again.');
      setIsRestoring(false);
    }
  };

  const handlePermanentDelete = async () => {
    setIsPermanentlyDeleting(true);
    try {
      const response = await fetch(`/api/analytics?id=${url._id}&permanent=true`, { method: 'DELETE' });
      if (response.ok) {
        setIsPermanentlyDeleting(false);
        toast.success('URL permanently deleted successfully!');
      } else {
        const error = await response.json();
        setDeleteError(error.message || 'Error permanently deleting URL');
        setIsPermanentlyDeleting(false);
      }
    } catch (error) {
      console.error('Error during permanent delete:', error);
      setDeleteError('An unexpected error occurred. Please try again.');
      setIsPermanentlyDeleting(false);
    }
  };

  const isScheduledLive = !url.scheduledDate || new Date(url.scheduledDate) <= new Date();
  return (
    <section className="flex justify-between gap-2">
      <article className="flex flex-col mb-4 mt-2 space-y-1 text-sm *:flex *:items-center *:space-x-2">
        <span className="font-mono text-xs text-muted-foreground"> {url._id} </span>
        <span className=""> {expirationStatus} </span>
        <span className="">
          {isScheduledLive ? (
            <span className='px-2 py-.5 mt-1 font-bold rounded-lg bg-green-400/20 small-caps text-green-500/80'>Live</span>
          ) : url.scheduledDate ? (
            <span><b>Scheduled: </b><span className="text-muted-foreground">{new Date(url.scheduledDate).toLocaleString()}</span></span>
          ) : (
            <span><b>Scheduled: </b> <span className="text-muted-foreground">Not set</span></span>
          )}
        </span>

      </article>
      <aside className="flex flex-col items-end space-y-2">

        {url.deletedAt && (
          <div className="flex space-x-2">
            {isRestoring ? (
              <span className="animate-pulse"><MdRestore /></span>
            ) : (
              <Button
                size='icon'
                onClick={handleRestore}
                className="px-3 py-1 bg-[#e5f7ff] dark:bg-[#002b3d] rounded-full text-[#34aadf] hover:bg-[#d0e9f9] border border-[#34aadf88]"
                disabled={isRestoring}
              >
                <MdRestore className="scale-125" />
              </Button>
            )}
            {restoreError && <span className="mt-1 text-red-500">{restoreError}</span>}
            {isPermanentlyDeleting ? (
              <span className="animate-pulse"><ImFire /></span>
            ) : (
              <Button
                size='icon'
                onClick={handlePermanentDelete}
                className="px-3 py-1 bg-[#ffecec] dark:bg-[#410b00] rounded-full text-red-500 hover:bg-[#ffdede] border border-red-500/50"
                disabled={isPermanentlyDeleting}
              >
                <ImFire />
              </Button>
            )}
            {deleteError && <span className="mt-1 text-red-500">{deleteError}</span>}
          </div>
        )}
        {url.duplicateCount > 1 && (
          <span title="Duplicate count" className="flex flex-row items-center justify-center px-2 py-1 space-x-2 text-base border rounded-full"><PiStackDuotone className="w-4 h-4" /><span>{url.duplicateCount}</span></span>)}
      </aside>
    </section>
  );
};
