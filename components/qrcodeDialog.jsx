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
    }
    return url;
  };

  const handleCancel = () => {
    setOpen(false);
  };

  const downloadQRCode = async () => {
    if (qrCodeRef.current) {
      const svgElement = qrCodeRef.current.querySelector('svg');
      if (svgElement) {
        const svgData = new XMLSerializer().serializeToString(svgElement);

        // Find the image tag within the SVG and fetch the image as a Blob
        const imageElement = svgElement.querySelector('image');
        if (imageElement && imageElement.href.baseVal) {
          const imageUrl = imageElement.href.baseVal;

          // Fetch the image and convert it to Base64
          const imageResponse = await fetch(imageUrl);
          const imageBlob = await imageResponse.blob();
          const reader = new FileReader();

          reader.onloadend = () => {
            // Get the Base64 encoded image data
            const base64Image = reader.result.split(',')[1]; // Get data after 'data:image/png;base64,'
            // Replace the image URL with Base64 data in the SVG
            const updatedSvgData = svgData.replace(imageUrl, `data:image/png;base64,${base64Image}`);
            // Create a new Blob with the updated SVG content
            const updatedSvgBlob = new Blob([updatedSvgData], { type: 'image/svg+xml' });
            // Create a canvas to draw the SVG
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const img = new Image();

            img.onload = function () {
              canvas.width = img.width;
              canvas.height = img.height;
              ctx.drawImage(img, 0, 0);

              // Convert to PNG and trigger download
              const pngUrl = canvas.toDataURL('image/png');
              const a = document.createElement('a');
              a.href = pngUrl;
              a.download = `qr-code_${shortenUrl}.png`;
              a.click();
            };

            img.src = URL.createObjectURL(updatedSvgBlob);
          };

          reader.readAsDataURL(imageBlob);
        }
      }
    }
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
          <Button variant="outline" onClick={downloadQRCode} className="my-2 sm:my-0">
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
