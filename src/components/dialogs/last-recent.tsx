import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@components/ui/dialog";

import useSWR, { mutate } from "swr";
import { PiDevicesLight, PiGoogleChromeLogoLight } from "react-icons/pi";
import { FaFirefox, FaSafari, FaEdge, FaChrome, FaMobileAlt, FaLaptop } from "react-icons/fa";
import { Button } from "@components/ui/button";
import { URLDocument } from "@/types/types";

// Function to fetch data
const fetcher = (url: string) => fetch(url).then((res) => res.json());

const getBrowserIcon = (userAgent: string) => {
  if (/Chrome/i.test(userAgent)) {
    return <PiGoogleChromeLogoLight />;
  } else if (/Firefox/i.test(userAgent)) {
    return <FaFirefox />;
  } else if (/Safari/i.test(userAgent) && !/Chrome/i.test(userAgent)) {
    return <FaSafari />;
  } else if (/Edge/i.test(userAgent)) {
    return <FaEdge />;
  }
  return <FaChrome title="Unknown" />;
};

const getDeviceType = (userAgent: string) => {
  if (/mobile/i.test(userAgent)) return <FaMobileAlt />;
  return <FaLaptop />;
};

interface RecentAccessesDialogProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const LastRecent = ({ open, setOpen }: RecentAccessesDialogProps) => {
  const { data: urls, error } = useSWR("/api/analytics?action=recent-ten", fetcher);

  if (error) return <div className="p-2">Error loading data</div>;
  if (!urls) return <div></div>;

  const handleRefresh = () => {
    mutate("/api/analytics?action=recent-ten"); // Trigger re-fetch for the specific key
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        className="max-w-[90%] lg:max-w-[40%] max-h-[80vh] rounded"
        aria-describedby={undefined}
      >
        <DialogHeader>
          <DialogTitle>Recent Accesses</DialogTitle>
        </DialogHeader>
        {/* Putting 60vh max height here works too  */}
        <div className="overflow-x-hidden md:p-3">
          {urls.length === 0 ? (
            <p>No recent accesses found.</p>
          ) : (
            <>
              <main className="flex flex-col space-y-3 overflow-auto max-h-[55vh]">
                <table className="min-w-full border-collapse table-auto">
                  <thead>
                    <tr>
                      <th className="px-4 py-2 text-sm font-semibold text-left text-gray-400">URL</th>
                      <th className="px-4 py-2 text-sm font-semibold text-left text-gray-400 min-w-[120px]">Access Date</th>
                      {/* <th className="py-2 text-sm font-semibold text-gray-400">Country</th> */}
                      <th className="px-4 py-2 text-sm font-semibold text-center text-gray-400">Browser</th>
                      <th className="px-4 py-2 text-sm font-semibold text-center text-gray-400"> <PiDevicesLight className="w-6 h-6" /> </th>
                    </tr>
                  </thead>
                  <tbody>
                    {urls.map((url: URLDocument) => (
                      <tr key={url._id} className="max-h-14">
                        <td className="inline-flex items-center p-1.5 m-1 font-mono border text-xs dark:border-neutral-700 rounded-md text-primary hover:underline overflow-x-auto w-20 lg:w-28 scrollbar-none whitespace-nowrap c-beige:text-beige-700">{url.shortenUrl}</td>
                        <td className="px-4 py-2 font-mono text-sm text-muted-foreground min-w-[120px] whitespace-nowrap">{new Date(url.accesses.lastAccessed[0]?.date).toLocaleString()}</td>
                        {/* <td
                          className="py-2 text-sm text-muted-foreground" align="center">{url.accesses.lastAccessed[0]?.country}</td> */}
                        {/* Removing this because in any case it does not work, in above do w-[60px] for width management if this is added again */}
                        <td className="py-2 text-sm text-muted-foreground" align="center">{getBrowserIcon(url.accesses.lastAccessed[0]?.userAgent)}</td>
                        <td className="py-2 pl-5 text-sm text-muted-foreground">{getDeviceType(url.accesses.lastAccessed[0]?.userAgent)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </main>
            </>)}
        </div>
        <DialogFooter className="gap-2 mx-8 sm:ml-0 sm:justify-start">
          <Button onClick={handleRefresh} variant={'outline'}>Refresh</Button>
          <DialogClose asChild>
            <Button variant="outline">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default LastRecent;
