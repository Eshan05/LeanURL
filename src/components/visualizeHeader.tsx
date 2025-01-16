"use client"

import {
  Button
} from "@/components/ui/button";
import { ChartColorOptions, URLWithDuplicateCount } from "@/types/types";
import ColorPicker from "@/components/colorPicker";
import {
  generateAnalogousColors,
  generateHeatmapColors,
  generateTreemapColors,
} from "@/lib/utils/utils";
import {
  CheckIcon,
  ChevronsUpDownIcon,
  ExternalLinkIcon,
  HistoryIcon,
  Link2Icon,
  LinkIcon,
  SearchIcon,
} from "lucide-react";

import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import { useState } from "react";

interface VisualizeHeaderProps {
  urls: URLWithDuplicateCount[];
  selectedUrl: URLWithDuplicateCount | null;
  onSearchMobile: () => void;
  onRecentSelect: React.Dispatch<React.SetStateAction<boolean>>;
  onUrlSelect: (url: URLWithDuplicateCount | null) => void;
  options: ChartColorOptions;
  setOptions: React.Dispatch<React.SetStateAction<ChartColorOptions>>;
}

const VisualizeHeader: React.FC<VisualizeHeaderProps> = ({
  urls,
  selectedUrl,
  onSearchMobile,
  onUrlSelect,
  onRecentSelect,
  options,
  setOptions,
}) => {
  const [open, setOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  return (
    <header className="relative flex flex-col items-center justify-center w-full mb-10 space-y-8 overflow-hidden">
      {/* Action Buttons Section */}
      <article className="flex flex-col items-center justify-center space-y-2">
        <section className="flex items-center justify-center space-x-2">
          <Button
            type="button"
            variant="outline"
            className="flex"
            onClick={onSearchMobile}
          >
            <span className="flex w-4 aspect-square">
              <SearchIcon />
            </span>
          </Button>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-[200px] justify-between"
              >
                {selectedUrl
                  ? selectedUrl.shortenUrl
                  : "Select URL"}
                <ChevronsUpDownIcon className="opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
              <Command>
                <CommandInput
                  placeholder="Search URL"
                  className="h-9"
                />
                <CommandList className="scrollbar-none">
                  <CommandEmpty>No URL found.</CommandEmpty>
                  <CommandGroup className="">
                    <ScrollArea className="">
                      <div className="max-h-48">
                        {urls.map((url) => (
                          <CommandItem
                            key={url._id}
                            value={url.shortenUrl}
                            onSelect={(currentValue) => {
                              const selected = urls.find((u) => u.shortenUrl === currentValue) || null
                              onUrlSelect(selected)
                              setOpen(false)
                            }}
                          >
                            <span className="pl-1">{url.shortenUrl}</span>
                            <CheckIcon
                              className={`ml-auto ${selectedUrl?._id === url._id ? "opacity-100" : "opacity-0"} w-4 h-4 mr-1`}
                            />
                          </CommandItem>
                        ))}
                      </div>
                    </ScrollArea>
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </section>
        <section className="flex items-center justify-center space-x-2">
          <Button onClick={() => onRecentSelect(true)} variant="outline" className="flex items-center w-[200px] space-x-2"><HistoryIcon className="w-4 h-4" /><span>Last 10 Recent</span></Button>
          {selectedUrl && (
            <HoverCard>
              <HoverCardTrigger asChild>
                <Button variant="outline"><Link2Icon className="w-4 h-4" /></Button>
              </HoverCardTrigger>
              <HoverCardContent className="w-max dark:bg-[#2222] bg-[#ccc2] backdrop-blur-md">
                <footer className="*:flex *:items-center *:space-x-4 flex flex-col space-y-2 text-xs">
                  <p>
                    <LinkIcon className="w-5 h-5 c-beige:text-beige-700" />
                    <span className="inline-block px-3 py-1.5 font-mono border dark:border-neutral-700 rounded-lg text-primary hover:underline overflow-x-auto w-[128px] scrollbar-none whitespace-nowrap c-beige:text-beige-700">
                      {selectedUrl?.shortenUrl}
                    </span>
                  </p>
                  <p>
                    <ExternalLinkIcon className="w-5 h-5 c-beige:text-beige-700" />
                    <span className="inline-block px-3 py-1.5 font-mono border dark:border-neutral-700 rounded-lg text-primary hover:underline overflow-x-auto w-[128px] scrollbar-none whitespace-nowrap c-beige:text-beige-700">
                      {selectedUrl?.originalUrl}
                    </span>
                  </p>
                </footer>
              </HoverCardContent>
            </HoverCard>
          )}

        </section>
      </article>
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
    </header>
  );
};

export default VisualizeHeader;
