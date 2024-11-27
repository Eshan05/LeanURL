import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogClose } from '@components/ui/dialog';
import { Button } from '@components/ui/button';
import { useState } from 'react';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { FaChrome, FaFirefox, FaSafari, FaEdge, FaMobileAlt, FaLaptop } from 'react-icons/fa';
import { PiDevicesLight } from "react-icons/pi";

const RecentAccessesDialog = ({ open, setOpen, recentAccesses }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(recentAccesses.length / itemsPerPage);

  const currentItems = recentAccesses.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  // Detect Browser Icon based on the userAgent
  const getBrowserIcon = (userAgent) => {
    if (/Chrome/i.test(userAgent)) {
      return <FaChrome className="" />;
    } else if (/Firefox/i.test(userAgent)) {
      return <FaFirefox className="" />;
    } else if (/Safari/i.test(userAgent) && !/Chrome/i.test(userAgent)) {
      return <FaSafari className="" />;
    } else if (/Edge/i.test(userAgent)) {
      return <FaEdge className="" />;
    }
    return <FaChrome className="" />;
  };

  const getDeviceType = (userAgent) => {
    if (/mobile/i.test(userAgent))
      return <FaMobileAlt className="" />;
    return <FaLaptop className="" />;
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-[90%] lg:max-w-[40%]">
        <DialogHeader>
          <DialogTitle>Recent Accesses</DialogTitle>
        </DialogHeader>

        <div className="md:p-3">
          {recentAccesses.length > 0 ? (
            <>
              <table className="min-w-full border-collapse table-auto">
                <thead>
                  <tr>
                    <th className="px-4 py-2 text-sm font-semibold text-left text-gray-400">#</th>
                    <th className="px-4 py-2 text-sm font-semibold text-left text-gray-400">Access Date</th>
                    <th className="px-4 py-2 text-sm font-semibold text-center text-gray-400">Browser</th>
                    <th className="px-4 py-2 text-sm font-semibold text-center text-gray-400"><PiDevicesLight className='w-6 h-6' /></th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((access, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50 dark:hover:bg-zinc-900/80">
                      <td className="px-4 py-2 text-sm text-gray-700 dark:text-gray-400">
                        {(currentPage - 1) * itemsPerPage + index + 1}
                      </td>
                      <td className="py-2 mx-4 font-mono text-sm text-muted-foreground">
                        {new Date(access.date).toLocaleString()}
                      </td>
                      <td className="py-2 text-sm text-muted-foreground" align='center'>
                        {getBrowserIcon(access.userAgent)}
                      </td>
                      <td className="py-2 pl-5 text-sm text-muted-foreground">
                        {getDeviceType(access.userAgent)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="flex items-center justify-between mt-4">
                <Button
                  variant="secondary"
                  className="px-4 py-2 text-sm font-semibold disabled:opacity-50"
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <span className="text-sm text-muted-foreground">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  variant="secondary"
                  className="px-4 py-2 text-sm font-semibold disabled:opacity-50"
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </>
          ) : (
            <p className="text-sm text-gray-500">No recent accesses</p>
          )}
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="secondary">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RecentAccessesDialog;
