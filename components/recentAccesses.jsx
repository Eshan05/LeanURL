import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogClose } from '@components/ui/dialog';
import { Button } from '@components/ui/button';
import { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { ChevronLeft } from 'lucide-react';

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

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md max-w-[90%]">
        <DialogHeader>
          <DialogTitle>Recent Accesses</DialogTitle>
        </DialogHeader>

        <div className="p-3">
          {recentAccesses.length > 0 ? (
            <>
              <table className="min-w-full border-collapse table-auto">
                <thead>
                  <tr className="">
                    <th className="px-4 py-2 text-sm font-semibold text-left text-gray-700">#</th>
                    <th className="px-4 py-2 text-sm font-semibold text-left text-gray-700">Access Date</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((date, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50 dark:hover:bg-zinc-900/80">
                      <td className="px-4 py-2 text-sm text-gray-700 dark:text-gray-400">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                      <td className="px-4 py-2 text-sm text-muted-foreground">{new Date(date).toLocaleString()}</td>
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
