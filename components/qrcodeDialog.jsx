import { useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogClose } from '@components/ui/dialog';
import { Button } from '@components/ui/button';

const QRCodeDialog = ({ open, setOpen, shortenUrl }) => {
  const qrCodeRef = useRef(null);
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
  console.log(BASE_URL);

  const generateQRCodeValue = (url) => {
    if (url && !url.startsWith('http://') && !url.startsWith('https://')) {
      if (process.env.BASE_URL == '') return `http://${BASE_URL}`;
      else return `${BASE_URL}${url}`;
      //? Coming as undefined?
    }
    return url;
  };

  const handleCancel = () => {
    setOpen(false);
  };

  const downloadQRCode = () => {
    if (qrCodeRef.current) {
      const svgElement = qrCodeRef.current.querySelector('svg');
      if (svgElement) {
        const svgData = new XMLSerializer().serializeToString(svgElement);
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        const img = new Image();
        const svgBlob = new Blob([svgData], { type: 'image/svg+xml' });
        const svgUrl = URL.createObjectURL(svgBlob);

        img.onload = function () {
          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0);
          const pngUrl = canvas.toDataURL('image/png');
          const a = document.createElement('a');
          a.href = pngUrl;
          a.download = `qr-code_${shortenUrl}.png`;
          a.click();
        };
        img.src = svgUrl;
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
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
          <Button variant="outline" onClick={downloadQRCode}>
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
