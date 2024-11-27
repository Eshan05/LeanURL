import { useRef, useState } from 'react';
import { QRCodeCanvas, QRCodeSVG } from 'qrcode.react';
import { ChartArea, Check, Copy, Github, HomeIcon, Link, Share } from 'lucide-react';

import { Nav } from '../components/nav'
import { Input } from '../components/ui/input'
import { Button } from '../components/ui/button'
import { toast } from 'sonner';
import { ImageDown } from 'lucide-react';
import SearchUrls from '@components/searchURL';
import { Command } from 'lucide-react';
import { GradientTop } from '@components/gradientTop';
import { LinkIcon } from 'lucide-react';
import { Trash2Icon } from 'lucide-react';
import { SearchIcon } from 'lucide-react';

export default function Home() {
  const [originalUrl, setOriginalUrl] = useState('');
  const [alias, setCustomAlias] = useState('');
  const [shortenUrl, setShortUrl] = useState('');
  const [error, setError] = useState('');
  const [clickedButton, setClickedButton] = useState(null);
  const qrCodeRef = useRef(null);

  const [expirationDate, setExpirationDate] = useState('');
  const [scheduledDate, setScheduledDate] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setShortUrl('');

    const formattedUrl = originalUrl.startsWith('http://') || originalUrl.startsWith('https://') || originalUrl.startsWith('BASE_URL')
      ? originalUrl
      : `http://${originalUrl}`;

    if (expirationDate && new Date(expirationDate) > new Date(Date.now() + 2 * 365 * 24 * 60 * 60 * 1000)) {
      return toast.error('Expiration date cannot be more than 2 years from the current date');
    }

    if (scheduledDate && new Date(scheduledDate) < new Date(Date.now())) {
      return toast.error('Scheduled date cannot be in the past');
    }

    if (expirationDate && scheduledDate && new Date(expirationDate) <= new Date(scheduledDate)) {
      return toast.error('Expiration date cannot be before or equal to scheduled date');
    }

    if (expirationDate && expirationDate <= new Date(Date.now())) {
      return toast.error('Expiration date cannot be in the past');
    }

    try {
      const res = await fetch('/api/shorten', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          originalUrl: formattedUrl,
          alias,
          // expirationDate: formattedExpirationDate,
          expirationDate: expirationDate ? new Date(expirationDate) : null,
          scheduledDate: scheduledDate ? new Date(scheduledDate) : null
        }),
      });

      const data = await res.json();
      console.log(data);
      if (!res.ok) throw new Error(data.message);
      setShortUrl(data.shortenUrl);
    } catch (err) {
      setError(err.message);

      if (err.message === 'This URL has already been shortened') { toast.error('This URL has already been shortened'); }
      else toast.error('An error occurred: ' + err.message);

    }
  };

  const BASE_URL = process.env.BASE_URL || originalUrl;
  const generateQRCodeValue = (url) => {
    if (url && !url.startsWith('http://') && !url.startsWith('https://')) {
      if (process.env.BASE_URL == '') return `http://${BASE_URL}`;
      else return `${url}`;
    }
    return url;
  };

  const handleCopy = () => {
    if (shortenUrl) {
      navigator.clipboard.writeText(shortenUrl)
        .then(() => {
          toast.success('URL copied to clipboard!');
        })
        .catch((err) => {
          toast.error('Failed to copy: ' + err);
        });
    }
  };

  const handleClick = (buttonName, action = () => { }) => {
    action();
    setClickedButton(buttonName);
    setTimeout(() => {
      setClickedButton(null);
    }, 1000);
  };

  const handleClear = () => {
    setOriginalUrl('');
    setCustomAlias('');
    setShortUrl('');
    setExpirationDate('');
    setScheduledDate('');
    setError('');
  };

  const handleSearchMobile = () => {
    const event = new KeyboardEvent('keydown', {
      key: 'k',
      metaKey: true,
    });
    document.dispatchEvent(event);
  }

  const downloadQRCode = () => {
    if (qrCodeRef.current) {
      const svgElement = qrCodeRef.current.querySelector('svg');
      if (svgElement) {
        const svgData = new XMLSerializer().serializeToString(svgElement);
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        // Create an image element to load the SVG as a source
        const img = new Image();
        const svgBlob = new Blob([svgData], { type: 'image/svg+xml' });
        const svgUrl = URL.createObjectURL(svgBlob);
        img.onload = function () {
          canvas.width = img.width;
          canvas.height = img.height;
          // Draw the SVG image on the canvas
          ctx.drawImage(img, 0, 0);

          // Convert the canvas to a PNG data URL
          const pngUrl = canvas.toDataURL('image/png');

          // Create an anchor element to trigger the download
          const a = document.createElement('a');
          a.href = pngUrl;
          a.download = `qr-code_${shortenUrl}.png`;
          a.click();
        };
        img.src = svgUrl;
      }
    }
  };

  // console.log("Look at me: ", generateQRCodeValue(shortenUrl));
  return (
    <main className="relative overflow-x-hidden flex flex-col items-center justify-center h-screen font-inter min-h-svh bg-zinc-50 dark:bg-[#09090b]">
      {/* Gradients */}
      <GradientTop />
      <Nav />
      <SearchUrls />
      <div className="relative w-full py-24 overflow-x-hidden">

        <div className="container relative py-10 lg:py-16">
          <main className="max-w-2xl mx-auto text-center">
            <p className="small-caps">URL Shortener + QR Code Generator</p>

            <header className="max-w-2xl mt-5">
              <h1 className="text-4xl font-extrabold tracking-tight scroll-m-20 lg:text-5xl">
                Enter The Link!
              </h1>
            </header>

            <article className="max-w-2xl mt-5">
              <p className="text-base lg:text-lg text-muted-foreground">
                Enter your link below. In case you want to<br className='md:hidden' /> see analytics or manage links
                head over to the <a href='/analytics' className='hover:underline hover:text-blue-500'><span>analytics page</span><LinkIcon className='inline-block w-6 ps-1 pe-1 aspect-square' /></a><br className='md:hidden' /> Each link can only be shortened once <span className='hidden lg:inline-flex'>(Press <kbd className="inline-flex items-center p-1 ml-2 mr-2 font-mono text-xs bg-gray-100 rounded ring-1 ring-gray-900/10 dark:bg-zinc-800 dark:ring-gray-900/50 dark:text-zinc-300 whitespace-nowrap">
                  <Command className="inline-block w-3 h-3" /><span className="text-[.25rem]">&nbsp;</span>+<span className="text-[.25rem]">&nbsp;</span>K
                </kbd> to see all URLs).</span>
              </p>
            </article>

            {/* Buttons */}
            <form className="flex flex-col justify-center gap-3 mt-8" onSubmit={handleSubmit}>
              <section className='flex flex-col justify-center gap-3 mt-2 md:flex-row'>
                <Input
                  tabIndex={1}
                  type="text"
                  placeholder="Enter original URL"
                  value={originalUrl}
                  onChange={(e) => setOriginalUrl(e.target.value)}
                  required
                />
                <Input
                  tabIndex={1}
                  type="text"
                  placeholder="Custom alias (optional)"
                  value={alias}
                  onChange={(e) => setCustomAlias(e.target.value)}
                />
              </section>
              <footer className="flex flex-row gap-3">
                <Button
                  tabIndex={2}
                  type="submit"
                  className="flex-1"
                  onClick={() => handleClick("shorten")}
                >
                  {clickedButton === "shorten" ? <Check /> : "Shorten"}
                </Button>
                <Button
                  tabIndex={2}
                  type="button"
                  className="flex-1 hidden lg:flex w-max"
                  onClick={() => handleClick("clear", handleClear)}
                >
                  {clickedButton === "clear" ? <Check /> : "Clear"}
                </Button>
                <Button
                  tabIndex={2}
                  type="button"
                  className="flex lg:hidden w-max"
                >
                  <span
                    className="flex w-4 aspect-square"
                    onClick={() => handleClick("clear", handleClear)}
                  >
                    {clickedButton === "clear" ? <Check /> : <Trash2Icon />}
                  </span>
                </Button>
                <Button type="button" tabIndex={2} variant="outline">
                  <span
                    className="flex w-4 aspect-square"
                    onClick={() => handleClick("copy", handleCopy)}
                  >
                    {clickedButton === "copy" ? <Check /> : <Copy />}
                  </span>
                </Button>
                <Button type="button" variant="outline"
                  tabIndex={2}
                  onClick={() => {
                    setClickedButton('share');
                    downloadQRCode();
                  }}>
                  <span className="flex w-4 aspect-square">
                    {clickedButton === "share" ? <Check /> : <ImageDown />}
                  </span>
                </Button>
                <Button type="button" variant="outline" className="hidden lg:block">
                  <a className="flex w-4 aspect-square"
                    href="https://github.com/Eshan05/LeanURL">
                    <Github /></a>
                </Button>
                <Button type="button" variant="outline" className="flex lg:hidden" onClick={handleSearchMobile}>
                  <span className="flex w-4 aspect-square">
                    <SearchIcon />
                  </span>
                </Button>
              </footer>
              <section className='flex flex-col justify-start items-start gap-3 mt-2 md:flex-row *:flex-1 p-2 md:mx-6 mx-10'>
                <div className='flex flex-col items-start w-full gap-1'>
                  <label className='text-xs font-medium text-muted-foreground ps-1'>Expiration Date</label>
                  <Input
                    tabIndex={3}
                    type="datetime-local"
                    placeholder="Expiration Date (Optional)"
                    value={expirationDate}
                    onFocus={(e) => e.target.type = 'datetime-local'}
                    onChange={(e) => setExpirationDate(e.target.value)}
                  />
                </div>
                <div className='flex flex-col items-start w-full gap-1 md:items-end'>
                  <label className='text-xs font-medium text-muted-foreground pe-1'>Scheduled Date</label>
                  <Input
                    tabIndex={3}
                    type="datetime-local"
                    placeholder="Scheduled Date (Optional)"
                    value={scheduledDate}
                    onFocus={(e) => e.target.type = 'datetime-local'}
                    onChange={(e) => setScheduledDate(e.target.value)}
                  />
                </div>
              </section>
            </form>

            <section className='mt-4'>
              {error && <p style={{ color: 'red' }}>{error}</p>}
              {shortenUrl && (
                <div className='flex flex-col items-center justify-center gap-4'>
                  <header className='relative flex flex-col items-center justify-center gap-2 mt-6 mb-2 w-max'>
                    <h2 className='absolute -top-[20%] font-mono pe-2 ps-2 bg-[#fafafa] dark:bg-[#09090b] font-light text-md text-muted-foreground small-caps'>Short url</h2>
                    <a href={shortenUrl}
                      target="_blank" rel="noopener noreferrer"
                      className='inline-block px-6 py-4 font-mono border rounded-lg text-primary hover:underline'
                    >{shortenUrl}</a>
                  </header>
                  <footer className='p-3 bg-white rounded-lg shadow' ref={qrCodeRef}>
                    <QRCodeSVG value={generateQRCodeValue(shortenUrl)}
                      title={"Scan me!"}
                      size={128}
                      bgColor={"#ffffff"}
                      fgColor={"#000000"}
                      level={"H"}
                      marginSize={1}
                      imageSettings={{
                        src: "https://images.vexels.com/content/137688/preview/logo-geometric-polygonal-shape-029edb.png",
                        x: undefined,
                        y: undefined,
                        height: 24,
                        width: 24,
                        opacity: 1,
                        excavate: true,
                      }} />
                  </footer>
                </div>
              )}
            </section>
          </main>
        </div>
      </div>

    </main >
  );
}
