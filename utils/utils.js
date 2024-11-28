import { toast } from "sonner";

export const downloadCSV = async () => {
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

export const downloadQRCode = async (qrCodeRef, shortenUrl) => {
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