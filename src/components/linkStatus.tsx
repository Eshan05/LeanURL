import { PiStackDuotone } from "react-icons/pi";

// Update the URL type to allow `undefined` for expirationDate and scheduledDate
type URL = {
  expirationDate?: Date;
  scheduledDate: Date | null;
  duplicateCount: number;
};

interface URLStatusProps {
  url: URL;
}

export const URLStatus = ({ url }: URLStatusProps) => {
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
  } else {
    expirationStatus = <span><b>Expiration: </b> <span className="text-muted-foreground">Not set</span></span>;
  }
  return (
    <section className="flex justify-between gap-2">
      <article className="flex flex-col mb-4 mt-2 space-y-1 text-sm *:flex *:items-center *:space-x-2">
        <span className="">
          {
            expirationStatus
          }
        </span>
        <span className="">
          {
            url.scheduledDate && new Date(url.scheduledDate) <= new Date()
              ? <span className='px-2 py-.5 mt-1 font-bold rounded-lg bg-green-400/20 small-caps text-green-500/80'>Live</span>
              : url.scheduledDate ? <span><b>Scheduled: </b><span className="text-muted-foreground">{new Date(url.scheduledDate).toLocaleString()}</span></span>
                : <span><b>Scheduled: </b> <span className="text-muted-foreground">Not set</span></span>
          }
        </span>
      </article>
      <aside className="mt-2">
        {url.duplicateCount > 1 && (
          <span title="Duplicate count" className="flex flex-row items-center space-x-2"><PiStackDuotone className="w-5 h-5" /><span>{url.duplicateCount}</span></span>)}
      </aside>
    </section>
  )
}
