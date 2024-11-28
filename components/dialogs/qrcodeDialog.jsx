import { useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogClose } from '@components/ui/dialog';
import { Button } from '@components/ui/button';
import { downloadQRCode } from '@utils/utils';

const QRCodeDialog = ({ open, setOpen, shortenUrl }) => {
  const qrCodeRef = useRef(null);
  const BASE_URL = process.env.BASE_URL;

  const generateQRCodeValue = (url) => {
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
      <DialogContent className="max-w-[90%] sm:max-w-md">
        <DialogHeader>
          <DialogTitle className='flex space-x-2'>QR Code</DialogTitle>
        </DialogHeader>
        <div className='grid p-2 place-items-center'>
          <section className="p-3 bg-white rounded-lg shadow max-w" ref={qrCodeRef}>
            <QRCodeSVG
              value={generateQRCodeValue(shortenUrl)}
              title="Scan me!"
              size={128}
              bgColor="#ffffff"
              fgColor="#000000"
              level="H"
              marginSize={1}
              imageSettings={{
                src: 'https://images.vexels.com/content/137688/preview/logo-geometric-polygonal-shape-029edb.png',
                x: undefined,
                y: undefined,
                height: 24,
                width: 24,
                opacity: 1,
                excavate: true,
              }}
            />
          </section>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => downloadQRCode(qrCodeRef, shortenUrl)} className="my-2 sm:my-0">
            Download QR Code
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
};

export default QRCodeDialog;
