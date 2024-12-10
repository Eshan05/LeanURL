import { Button, Select, SelectContent, SelectIcon, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/ui-index";
import { URLDocument, URLWithDuplicateCount } from "@/types/types";
import { Checkbox } from "@/components/ui/checkbox";
import ColorPicker from "@/components/colorPicker";
import { generateAnalogousColors, generateHeatmapColors, generateTreemapColors } from "@/lib/utils/utils";
import { ChevronDown, ExternalLinkIcon, LinkIcon, SearchIcon } from "lucide-react";


interface VisualizeHeaderProps {
  urls: URLWithDuplicateCount[];
  selectedUrl: URLWithDuplicateCount | null;
  onSearchMobile: () => void;
  onUrlSelect: (url: URLWithDuplicateCount | null) => void;
  options: {
    backgroundOptions: { color: string; };
    areaChartColor: string;
    areaChartColors: string[];
    treemapColor: string;
    treemapColors: string[];
    heatmapColor: string;
    heatmapColors: string[];
    radarChartColor: string;
  };
  setOptions: React.Dispatch<React.SetStateAction<{
    backgroundOptions: { color: string; };
    areaChartColor: string;
    areaChartColors: string[];
    treemapColor: string;
    treemapColors: string[];
    heatmapColor: string;
    heatmapColors: string[];
    radarChartColor: string;
  }>>;
}

const VisualizeHeader: React.FC<VisualizeHeaderProps> = ({
  urls,
  selectedUrl,
  onSearchMobile,
  onUrlSelect,
  options,
  setOptions,
}) => {
  return (
    <header className="relative flex flex-col items-center justify-center w-full mb-10 space-y-10 overflow-hidden">
      <h1 className="text-4xl font-extrabold tracking-tight scroll-m-20 lg:text-5xl c-beige:text-beige-800">
        Visualize
      </h1>

      {/* Action Buttons Section */}
      <section className="flex items-center justify-center space-x-2">
        <Button type="button" variant="outline" className="flex" onClick={onSearchMobile}>
          <span className="flex w-4 aspect-square">
            <SearchIcon />
          </span>
        </Button>
        <Select
          value={selectedUrl?._id || ""}
          onValueChange={(value: string) => {
            const selected = urls.find((url) => url._id === value) || null;
            onUrlSelect(selected || null);
          }}
        >
          <SelectTrigger className="lg:max-w-[50%] min-w-[200px] w-max max-w-[300px] focus-visible:ring-0 focus-visible:outline-none focus:ring-0 focus:ring-offset-0">
            <SelectValue placeholder="Select URL" />
            <SelectIcon asChild>
              <ChevronDown className="w-4 h-4 ml-4 opacity-50" />
            </SelectIcon>
          </SelectTrigger>
          <SelectContent>
            {urls.map((url) => (
              <SelectItem key={url._id} value={url._id}>
                {url.shortenUrl}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </section>

      {/* Color Picker Section */}
      <section className="flex items-center justify-center my-2 space-x-4 *:items-center">
        <div className="flex flex-col">
          <ColorPicker
            value={options.areaChartColor}
            onColorChange={(color: string) => {
              setOptions((options) => ({
                ...options,
                areaChartColor: color,
                areaChartColors: generateAnalogousColors(color),
              }));
            }}
          />
          <p className="font-mono text-xs text-muted-foreground">Area</p>
        </div>

        <div className="flex flex-col">
          <ColorPicker
            value={options.treemapColor}
            onColorChange={(color: string) => {
              setOptions((options) => ({
                ...options,
                treemapColor: color,
                treemapColors: generateTreemapColors(color),
              }));
            }}
          />
          <p className="font-mono text-xs text-muted-foreground">Tree</p>
        </div>

        <div className="flex flex-col">
          <ColorPicker
            value={options.heatmapColor}
            onColorChange={(color: string) => {
              const newHeatmapColors = generateHeatmapColors(color); // Generate 5 colors based on the selected color
              setOptions((prevOptions) => ({
                ...prevOptions,
                heatmapColor: color,
                heatmapColors: newHeatmapColors, // Update heatmapColors in options
              }));
            }}
          />
          <p className="font-mono text-xs text-muted-foreground">Heat</p>
        </div>

        <div className="flex flex-col">
          <ColorPicker
            value={options.radarChartColor}
            onColorChange={(color: string) => {
              setOptions((options) => ({
                ...options,
                radarChartColor: color, // Only base color for radar
              }));
            }}
          />
          <p className="font-mono text-xs text-muted-foreground">Radar</p>

        </div>
      </section>

      {/* Footer Section */}
      {selectedUrl && (
        <footer className="*:flex *:items-center *:space-x-4 flex flex-col space-y-2 text-xs">
          <p><LinkIcon className="w-5 h-5" /><span className="inline-block px-3 py-1.5 font-mono border rounded-lg text-primary hover:underline overflow-x-auto w-[128px] scrollbar-none whitespace-nowrap c-beige:text-beige-700">{selectedUrl?.shortenUrl}</span></p>
          <p><ExternalLinkIcon className="w-5 h-5" /><span className="inline-block px-3 py-1.5 font-mono border rounded-lg text-primary hover:underline overflow-x-auto w-[128px] scrollbar-none whitespace-nowrap c-beige:text-beige-700">{selectedUrl?.originalUrl}</span></p>
        </footer>
      )}
    </header>
  );
};

export default VisualizeHeader;