import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@components/ui/dialog";

import { getAuthToken } from "@/lib/utils";
import { URLDocument } from "@/types/types";
import { Button } from "@components/ui/button";
import { ListCollapseIcon } from "lucide-react";
import React, { useState } from "react";
import { FaChrome, FaEdge, FaFirefox, FaLaptop, FaMobileAlt, FaSafari } from "react-icons/fa";
import { PiDevicesLight, PiGoogleChromeLogoLight } from "react-icons/pi";
import { mutate } from "swr";
import useSWRImmutable from 'swr/immutable';

const fetcher = async (url: string) => {
  const token = getAuthToken();
  if (!token) {
    throw new Error('No token found. Please log in.');
  }
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.json();
};
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
  const { data: urls, error } = useSWRImmutable("/api/analytics?action=recent-ten", fetcher);
  const [visibleAccesses, setVisibleAccesses] = useState<{ [key: string]: boolean }>({});

  const handleToggleVisibility = (urlId: string) => {
    setVisibleAccesses((prev) => ({
      ...prev,
      [urlId]: !prev[urlId],
    }));
  };

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
                    {urls.map((url: URLDocument) => {
                      const sortedAccesses = url.accesses.lastAccessed
                        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                        .slice(0, 10); // Maybe configurable 

                      const mostRecentAccess = sortedAccesses[0];
                      const otherAccesses = sortedAccesses.slice(1);

                      return (
                        <React.Fragment key={url._id}>
                          <tr>
                            <td className="inline-flex items-center p-1.5 m-1 font-mono border text-xs dark:border-neutral-700 rounded-md text-primary hover:underline overflow-x-auto w-20 lg:w-28 scrollbar-none whitespace-nowrap c-beige:text-beige-700">
                              {url.shortenUrl}
                            </td>
                            <td className="px-4 py-2 font-mono text-sm text-muted-foreground min-w-[120px] whitespace-nowrap">
                              {new Date(mostRecentAccess.date).toLocaleString()}
                            </td>
                            <td className="py-2 text-sm text-muted-foreground" align="center">
                              {getBrowserIcon(mostRecentAccess.userAgent)}
                            </td>
                            <td className="py-2 pl-5 text-sm text-muted-foreground">
                              {getDeviceType(mostRecentAccess.userAgent)}
                            </td>

                            {otherAccesses.length > 0 && (
                              <td colSpan={4} className="text-center">
                                <Button
                                  size="sm-icon"
                                  onClick={() => handleToggleVisibility(url._id)}
                                >
                                  <ListCollapseIcon className="w-4 h-4" />
                                </Button>
                              </td>
                            )}
                          </tr>

                          {visibleAccesses[url._id] && otherAccesses.map((access, index) => (
                            <tr key={`${url._id}-other-access-${index}`}>
                              <td className="inline-flex items-center p-1.5 m-1 font-mono border text-xs dark:border-neutral-700 rounded-md text-primary hover:underline overflow-x-auto w-20 lg:w-28 scrollbar-none whitespace-nowrap c-beige:text-beige-700">
                                {url.shortenUrl}
                              </td>
                              <td className="px-4 py-2 font-mono text-sm text-muted-foreground min-w-[120px] whitespace-nowrap">
                                {new Date(access.date).toLocaleString()}
                              </td>
                              <td className="py-2 text-sm text-muted-foreground" align="center">
                                {getBrowserIcon(access.userAgent)}
                              </td>
                              <td className="py-2 pl-5 text-sm text-muted-foreground">
                                {getDeviceType(access.userAgent)}
                              </td>
                            </tr>
                          ))}
                        </React.Fragment>
                      );
                    })}
                  </tbody>
                </table>
              </main>
            </>)}
        </div>
        <DialogFooter className="mx-8 gap-y-2 sm:ml-0 sm:justify-start">
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
