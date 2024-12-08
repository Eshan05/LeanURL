"use client";

import React, { useEffect, useRef, useState, ChangeEvent } from "react";
import QRCodeStyling, { Options, FileExtension } from "qr-code-styling";
import ColorPicker from "@components/colorPicker";
import { Button } from "@components/ui/button";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@components/ui/select";
import { ChevronDown, DownloadIcon } from "lucide-react";
import { SelectIcon } from "@radix-ui/react-select";

export const CustomQR = ({ url }: { url: string }) => {
  const [options, setOptions] = useState<Options>({
    width: 132,
    height: 132,
    type: 'svg',
    data: url,
    image: 'https://images.vexels.com/content/137688/preview/logo-geometric-polygonal-shape-029edb.png',
    margin: 0,
    qrOptions: { // Object
      typeNumber: 0,
      mode: 'Byte',
      errorCorrectionLevel: 'H'
    },
    imageOptions: { // Object
      hideBackgroundDots: true,
      imageSize: 0.370,
      margin: 2,
      crossOrigin: 'anonymous',
      saveAsBlob: true,
    },
    cornersSquareOptions: {
      color: '#000',
      type: 'square' // Options: 'dot', 'square', 'extra-rounded'
    },
    dotsOptions: {
      color: '#000000',
      type: 'square' // So: 'rounded', 'square', 'dot', 'extra-rounded', 'classy', 'classy-rounded'
    },
    cornersDotOptions: {
      color: '#000',
      type: 'square', // Options: 'dot', 'square'
    },
    backgroundOptions: {
      color: '#fff',
    },
  });

  const [fileExt, setFileExt] = useState<FileExtension>("svg");
  const [qrCode, setQrCode] = useState<QRCodeStyling>();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setQrCode(new QRCodeStyling(options));
  }, [options])

  useEffect(() => {
    if (ref.current) {
      qrCode?.append(ref.current);
    }
  }, [qrCode, ref]);

  useEffect(() => {
    if (!qrCode) return;
    qrCode?.update(options);
  }, [qrCode, options]);

  const onDataChange = (event: ChangeEvent<HTMLInputElement>) => {
    setOptions(options => ({
      ...options,
      data: event.target.value
    }));
  };

  // const onExtensionChange = (event: ChangeEvent<HTMLSelectElement>) => { setFileExt(event.target.value as FileExtension); };
  const onExtensionChange = (value: FileExtension) => {
    setFileExt(value);
    console.log('Selected file extension:', value);
  };

  const onDownloadClick = () => {
    if (!qrCode) return;
    qrCode.download({
      extension: fileExt
    });
  };

  return (
    <section className="flex flex-col gap-4 md:flex-row dark:bg-transparent">
      <main className="flex flex-col items-center">
        <div className="p-3 bg-white rounded-lg shadow" ref={ref} />
        <div className="flex flex-row items-center justify-center gap-2 p-1 m-1 md:flex-row *:w-full">
          {/* <input value={options.data} onChange={onDataChange} className="" /> */}
          <Select value={fileExt} onValueChange={onExtensionChange}>
            <SelectTrigger className="min-w-24">
              <SelectValue placeholder="Select file format" />
              <SelectIcon asChild>
                <ChevronDown className='w-4 h-4 opacity-50' />
              </SelectIcon>
            </SelectTrigger>
            <SelectContent className="text-sm">
              <SelectGroup>
                <SelectLabel>File Format</SelectLabel>
                <SelectItem value="svg">SVG</SelectItem>
                <SelectItem value="png">PNG</SelectItem>
                <SelectItem value="jpeg">JPEG</SelectItem>
                <SelectItem value="webp">WEBP</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <Button onClick={onDownloadClick} size={"sm"} variant={"secondary"}><DownloadIcon className="w-4 h-4" /></Button>
        </div>
      </main>
      <aside>
        {/* <h3 className="text-base font-bold lg:text-lg text-muted-foreground c-beige:text-beige-700/60 small-caps">Customize</h3> */}
        <section>
          <header className="flex items-center justify-center my-2 space-x-4 *:items-center">
            <div className="flex flex-col">
              <ColorPicker
                value={options.backgroundOptions?.color}
                onColorChange={(color: string) => {
                  setOptions(options => ({
                    ...options,
                    backgroundOptions: {
                      ...options.backgroundOptions,
                      color
                    }
                  }));
                }}
              />
              <p className="font-mono text-xs text-muted-foreground">BG</p>
            </div>
            <div className="flex flex-col">
              <ColorPicker
                value={options.dotsOptions?.color}
                onColorChange={(color: string) => {
                  setOptions(options => ({
                    ...options,
                    dotsOptions: {
                      ...options.dotsOptions,
                      color
                    }
                  }));
                }}
              />
              <p className="font-mono text-xs text-muted-foreground">Dots</p>
            </div>
            <div className="flex flex-col">
              <ColorPicker
                value={options.cornersSquareOptions?.color}
                onColorChange={(color: string) => {
                  setOptions(options => ({
                    ...options,
                    cornersSquareOptions: {
                      ...options.cornersSquareOptions,
                      color
                    }
                  }));
                }}
              />
              <p className="font-mono text-xs text-muted-foreground">Corners</p>
            </div>
            <div className="flex flex-col">
              <ColorPicker
                value={options.cornersDotOptions?.color}
                onColorChange={(color: string) => {
                  setOptions(options => ({
                    ...options,
                    cornersDotOptions: {
                      ...options.cornersDotOptions,
                      color
                    }
                  }));
                }}
              />
              <p className="font-mono text-xs text-muted-foreground">Eyes</p>
            </div>
          </header>
          <article className="flex flex-col flex-wrap gap-3 lg:w-[80%] mx-auto md:flex-row">
            {/* Choosing types for dots in QRCode */}
            <Select
              value={options.dotsOptions?.type || 'square'}
              onValueChange={(value) => {
                setOptions((prevOptions) => ({
                  ...prevOptions,
                  dotsOptions: {
                    ...prevOptions.dotsOptions,
                    type: value as 'square' | 'rounded' | 'extra-rounded' | 'classy' | 'classy-rounded' | 'dots',
                  },
                }));
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Choose Dot Type" />
                <SelectIcon asChild>
                  <ChevronDown className='w-4 h-4 opacity-50' />
                </SelectIcon>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="square">Square</SelectItem>
                <SelectItem value="rounded">Rounded</SelectItem>
                <SelectItem value="extra-rounded">Extra-Rounded</SelectItem>
                <SelectItem value="classy">Classy</SelectItem>
                <SelectItem value="classy-rounded">Classy-Rounded</SelectItem>
                <SelectItem value="dots">Dot</SelectItem>
              </SelectContent>
            </Select>
            {/* Choosing type of corner */}
            <Select
              value={options.cornersSquareOptions?.type || 'square'}
              onValueChange={(value) => {
                setOptions((prevOptions) => ({
                  ...prevOptions,
                  cornersSquareOptions: {
                    ...prevOptions.cornersSquareOptions,
                    type: value as 'square' | 'dot' | 'extra-rounded',
                  },
                }));
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Corner Type" />
                <SelectIcon asChild>
                  <ChevronDown className='w-4 h-4 opacity-50' />
                </SelectIcon>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="square">Square</SelectItem>
                <SelectItem value="dot">Dot</SelectItem>
                <SelectItem value="extra-rounded">Extra-Rounded</SelectItem>
              </SelectContent>
            </Select>
            {/* Choosing type of corner dot */}
            <Select
              value={options.cornersDotOptions?.type}
              onValueChange={(value) => {
                setOptions(options => ({
                  ...options,
                  cornersDotOptions: {
                    ...options.cornersDotOptions,
                    type: value as 'square' | 'dot'
                  }
                }));
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Corner Dot Type" />
                <SelectIcon asChild>
                  <ChevronDown className='w-4 h-4 opacity-50' />
                </SelectIcon>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="square">Square</SelectItem>
                <SelectItem value="dot">Dot</SelectItem>
              </SelectContent>
            </Select>
          </article>
        </section>
      </aside>
    </section>
  );
}

