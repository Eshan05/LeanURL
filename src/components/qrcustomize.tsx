"use client";

import React, { useEffect, useRef, useState, ChangeEvent } from "react";
import QRCodeStyling, { Options, FileExtension } from "qr-code-styling";
import ColorPicker from "./colorPicker";

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

  const onExtensionChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setFileExt(event.target.value as FileExtension);
  };

  const onDownloadClick = () => {
    if (!qrCode) return;
    qrCode.download({
      extension: fileExt
    });
  };

  return (
    <section className="flex gap-4">
      <main>
        <div className="" ref={ref} />
        <div className="">
          {/* <input value={options.data} onChange={onDataChange} className="" /> */}
          <select onChange={onExtensionChange} value={fileExt}>
            <option value="svg">SVG</option>
            <option value="png">PNG</option>
            <option value="jpeg">JPEG</option>
            <option value="webp">WEBP</option>
          </select>
          <button onClick={onDownloadClick}>Download</button>
        </div>
      </main>
      <aside>
        <h3>Customize:</h3>
        <section>
          <header>
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
          </header>
          <article>
            {/* Choosing types for dots in QRCode */}
            <select
              value={options.dotsOptions?.type}
              onChange={(e) => {
                setOptions((prevOptions) => ({
                  ...prevOptions,
                  dotsOptions: {
                    ...prevOptions.dotsOptions,
                    type: e.target.value as 'square' | 'rounded' | 'extra-rounded' | 'classy' | 'classy-rounded' | 'dots', // Restrict to valid types
                  },
                }));
              }}
            >
              <option value="square">Square</option>
              <option value="rounded">Rounded</option>
              <option value="extra-rounded">Extra-Rounded</option>
              <option value="classy">Classy</option>
              <option value="classy-rounded">Classy-Rounded</option>
              <option value="dots">Dot</option>
            </select>
            {/* Choosing type of corner */}
            <select
              value={options.cornersSquareOptions?.type}
              onChange={(e) => {
                setOptions(options => ({
                  ...options,
                  cornersSquareOptions: {
                    ...options.cornersSquareOptions,
                    type: e.target.value as 'square' | 'dot' | 'extra-rounded'
                  }
                }));
              }}
            >
              <option value="square">Square</option>
              <option value="dot">Dot</option>
              <option value="extra-rounded">Extra-Rounded</option>
            </select>
            {/* Choosing type of corner dot */}
            <select
              value={options.cornersDotOptions?.type}
              onChange={(e) => {
                setOptions(options => ({
                  ...options,
                  cornersDotOptions: {
                    ...options.cornersDotOptions,
                    type: e.target.value as 'square' | 'dot'
                  }
                }));
              }}
            >
              <option value="square">Square</option>
              <option value="dot">Dot</option>
              <option value="extra-rounded">Extra-Rounded</option>
            </select>
          </article>
        </section>
      </aside>
    </section>
  );
}

