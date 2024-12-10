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

export const getStartOfMonthQ = () => {
  const now = new Date();
  now.setDate(1);  // Set the date to the first day of the current month
  now.setHours(0, 0, 0, 0);  // Set the time to midnight
  return now;
};

export const hexToHSL = (hex: string): { h: number; s: number; l: number } => {
  let r = 0, g = 0, b = 0;

  // Handle 3-character hex
  if (hex.length === 4) {
    r = parseInt(hex[1] + hex[1], 16);
    g = parseInt(hex[2] + hex[2], 16);
    b = parseInt(hex[3] + hex[3], 16);
  } else if (hex.length === 7) {
    // Handle 6-character hex
    r = parseInt(hex[1] + hex[2], 16);
    g = parseInt(hex[3] + hex[4], 16);
    b = parseInt(hex[5] + hex[6], 16);
  }

  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === r) h = (g - b) / d + (g < b ? 6 : 0);
    else if (max === g) h = (b - r) / d + 2;
    else if (max === b) h = (r - g) / d + 4;
    h /= 6;
  }

  return { h: h * 360, s: s * 100, l: l * 100 };
};

export const hslToHex = (h: number, s: number, l: number): string => {
  s /= 100;
  l /= 100;

  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs((h / 60) % 2 - 1));
  const m = l - c / 2;

  let r = 0, g = 0, b = 0;

  if (h >= 0 && h < 60) { r = c; g = x; b = 0; }
  else if (h >= 60 && h < 120) { r = x; g = c; b = 0; }
  else if (h >= 120 && h < 180) { r = 0; g = c; b = x; }
  else if (h >= 180 && h < 240) { r = 0; g = x; b = c; }
  else if (h >= 240 && h < 300) { r = x; g = 0; b = c; }
  else if (h >= 300 && h < 360) { r = c; g = 0; b = x; }

  r = Math.round((r + m) * 255);
  g = Math.round((g + m) * 255);
  b = Math.round((b + m) * 255);

  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()}`;
};

export const generateAnalogousColors = (baseColor: string, count: number = 5): string[] => {
  const { h, s, l } = hexToHSL(baseColor);
  const colors: string[] = [];

  for (let i = 0; i < count; i++) {
    const hue = (h + i * (360 / count)) % 360; // Distribute hues evenly
    colors.push(hslToHex(hue, s, l));
  }

  return colors;
};

export const generateTreemapColors = (baseColor: string, count: number = 5): string[] => {
  const { h: baseH, s, l } = hexToHSL(baseColor);
  const colors: string[] = [];

  for (let i = 0; i < count; i++) {
    const hue = (baseH + i * (360 / count)) % 360;
    const lightness = Math.min(100, Math.max(0, l + i * (10 - count)));
    colors.push(hslToHex(baseH, s, lightness));
  }

  return colors;
};

export const generateHeatmapColors = (baseColor: string, steps: number = 5): string[] => {
  const { h, s, l } = hexToHSL(baseColor);
  const colors: string[] = [];

  for (let i = 0; i < steps; i++) {
    const lightness = l - i * (l / steps); // Gradually darken
    colors.push(hslToHex(h, s, lightness));
  }

  return colors;
};
