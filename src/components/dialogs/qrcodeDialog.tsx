import { useRef } from 'react';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogClose, DialogDescription } from '@components/ui/dialog';
import { Button } from '@components/ui/button';
import { downloadQRCode } from '@utils/utils';
import { CustomQR } from '@components/qrcustomize';

interface QRCodeDialogProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  shortenUrl: string;
}

const QRCodeDialog = ({ open, setOpen, shortenUrl }: QRCodeDialogProps) => {
  const qrCodeRef = useRef<HTMLElement>(null);
  const BASE_URL = process.env.BASE_URL;

  const generateQRCodeValue = (url: string) => {
    if (url && !url.startsWith('http://') && !url.startsWith('https://')) {
      if (process.env.BASE_URL == '') return `http://${BASE_URL}`;
      else return `${BASE_URL}${url}`;
    }
    return url;
  };

  const handleCancel = () => {
    setOpen(false);
  };


  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-[90%] md:max-w-max">
        <DialogHeader>
          <DialogTitle className='flex space-x-2'>QR Code</DialogTitle>
        </DialogHeader>
        <DialogDescription className='hidden' />
        <div className='grid p-2 place-items-center'>
          <section className="p-3 bg-white rounded-lg" ref={qrCodeRef}>
            <CustomQR url={generateQRCodeValue(shortenUrl)} />
          </section>
        </div>

        <DialogFooter>
          {/* <Button variant="outline" onClick={() => downloadQRCode(qrCodeRef, shortenUrl)} className="my-2 sm:my-0"> Download QR Code </Button> */}
          <DialogClose asChild>
            <Button type="button" variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
          </DialogClose>
        </DialogFooter>

      </DialogContent>
    </Dialog>
  );
};

export default QRCodeDialog;
