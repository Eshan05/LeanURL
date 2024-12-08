import { toast } from "sonner";

export const downloadCSV = async (): Promise<void> => {
  try {
    const res = await fetch('/api/csvAnalytics');
    if (!res.ok) throw new Error('Failed to fetch CSV');

    // Create a blob from the response and trigger the download
    const csvBlob = await res.blob();
    const csvUrl = URL.createObjectURL(csvBlob);
    const link = document.createElement('a');
    link.href = csvUrl;
    link.download = 'urls.csv';  // Set the file name for the CSV
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success('CSV file downloaded!');
  } catch (error) {
    toast.error('Error downloading CSV');
  }
};

export const downloadQRCode = async (
  qrCodeRef: React.RefObject<HTMLElement>,
  shortenUrl: string
): Promise<void> => {
  if (qrCodeRef.current) {
    const svgElement = qrCodeRef.current.querySelector('svg');
    if (svgElement) {
      const svgData: string = new XMLSerializer().serializeToString(svgElement);

      // Find the image tag within the SVG and fetch the image as a Blob
      const imageElement = svgElement.querySelector('image');
      if (imageElement && imageElement.href.baseVal) {
        const imageUrl: string = imageElement.href.baseVal;

        // Fetch the image and convert it to Base64
        const imageResponse = await fetch(imageUrl);
        const imageBlob = await imageResponse.blob();
        const reader = new FileReader();

        reader.onloadend = () => {
          if (!reader.result || typeof reader.result !== 'string') return;
          // Get the Base64 encoded image data
          console.log(reader.result);
          const base64Image: string = reader.result.split(',')[1]; // Get data after 'data:image/png;base64,'
          // Replace the image URL with Base64 data in the SVG
          const updatedSvgData: string = svgData.replace(imageUrl, `data:image/png;base64,${base64Image}`);
          // Create a new Blob with the updated SVG content
          const updatedSvgBlob: Blob = new Blob([updatedSvgData], { type: 'image/svg+xml' });
          // Create a canvas to draw the SVG
          const canvas: HTMLCanvasElement = document.createElement('canvas');
          const ctx: CanvasRenderingContext2D | null = canvas.getContext('2d');
          const img: HTMLImageElement = new Image();

          img.onload = function () {
            canvas.width = img.width;
            canvas.height = img.height;
            // @ts-ignore
            ctx.drawImage(img, 0, 0);

            // Convert to PNG and trigger download
            const pngUrl: string = canvas.toDataURL('image/png');
            const a: HTMLAnchorElement = document.createElement('a');
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

export const getStartOfWeekQ = (): Date => {
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0 (Sunday) to 6 (Saturday)
  const offset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // Adjust to get Monday
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() + offset);
  startOfWeek.setHours(0, 0, 0, 0);
  return startOfWeek;
};