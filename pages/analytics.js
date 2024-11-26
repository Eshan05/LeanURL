import { useRouter } from 'next/router';
import { useEffect, useState, useRef } from "react";

import { ChartSpline, Copy, Check, Mouse, Trash2, ImageDown, MousePointerClick, Database } from "lucide-react";
import { QrCode, Calendar, Pencil, Link, ExternalLink, RefreshCcw } from "lucide-react";

import { Nav } from "@components/nav";
import { Input } from "@components/ui/input";
import { Button } from "@components/ui/button";
import { toast } from "sonner";
import { DeleteUrlDialog } from "@components/deleteUrl";
import { EditUrlDialog } from "@components/editUrl";
import QRCodeDialog from "@components/qrcodeDialog";
import RecentAccessesDialog from "@components/recentAccesses";
import AccessGraphDialog from "@components/graphDialog";
import { GradientTop } from '@components/gradientTop';

export default function Analytics() {
  const [urls, setUrls] = useState([]);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [clickedButton, setClickedButton] = useState(null);
  const [copiedUrl, setCopiedUrl] = useState(null);
  const [open, setOpen] = useState(false);
  const [urlToDelete, setUrlToDelete] = useState(null);
  const [openEdit, setOpenEdit] = useState(false);
  const [urlToEdit, setUrlToEdit] = useState(null);
  const [openQR, setOpenQR] = useState(false);
  const [urlToQRCode, setUrlToQRCode] = useState(null);
  const [openRecents, setOpenRecents] = useState(false);
  const [selectedUrl, setSelectedUrl] = useState(null);
  const [openGraphDialog, setOpenGraphDialog] = useState(false);

  const router = useRouter();
  const { query } = router;

  const fetchUrls = async () => {
    try {
      const res = await fetch('/api/analytics');
      const data = await res.json();
      setUrls(data); // Store the fetched data in state
    } catch (error) {
      setError('Failed to fetch URLs');
    }
  };

  useEffect(() => {
    fetchUrls();
  }, []);

  const refreshData = () => {
    fetchUrls();
    toast.success('Data refreshed successfully!');
  };

  const handleCopy = (shortenUrl) => {
    if (shortenUrl) {
      navigator.clipboard.writeText(shortenUrl)
        .then(() => {
          toast.success('URL copied to clipboard!');
          setCopiedUrl(shortenUrl);
        })
        .catch((err) => {
          toast.error('Failed to copy: ' + err);
        });
    }
  };

  const handleEdit = async (urlId, updatedFields) => {
    try {
      const res = await fetch(`/api/analytics?id=${urlId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedFields),
      });

      if (res.ok) {
        // Update the URL in state with the new fields
        setUrls(urls.map(url => url._id === urlId ? { ...url, ...updatedFields } : url));
        toast.success('URL updated successfully!');
      } else {
        // Handle error from API response
        const { message } = await res.json();
        toast.error(message || 'Failed to update URL');
      }
    } catch (error) {
      toast.error('Error updating URL');
    }
  };


  const handleDelete = async (urlId) => {
    try {
      const res = await fetch(`/api/analytics?id=${urlId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setUrls(urls.filter((url) => url._id !== urlId));  // Remove the deleted URL from the state
        toast.success('URL deleted successfully!');
      } else {
        const { message } = await res.json();
        toast.error(message || 'Failed to delete URL');
      }
    } catch (error) {
      toast.error('Error deleting URL');
    }
  };

  const handleClick = (buttonName, action = () => { }) => {
    action();
    setClickedButton(buttonName);
    setTimeout(() => {
      setClickedButton(null);
    }, 1000);
  };

  const handleClickQRCode = (shortenUrl) => {
    setUrlToQRCode(shortenUrl);
    setOpenQR(true);
  };

  const handleShowRecents = (url) => {
    if (url && url.accesses && Array.isArray(url.accesses.lastAccessed)) {
      setSelectedUrl(url);
      setOpenRecents(true);
    } else {
      setSelectedUrl(null);
      setOpenRecents(false);
    }
  };

  const handleOpenGraphDialog = (url) => {
    if (url && url.accesses && Array.isArray(url.accesses.lastAccessed)) {
      setSelectedUrl(url);
      setOpenGraphDialog(true);
    } else {
      setSelectedUrl(null);
      setOpenGraphDialog(false);
    }
  };

  const filteredUrls = urls.filter((url) =>
    url.shortenUrl.toLowerCase().includes(searchTerm.toLowerCase()) ||
    url.originalUrl.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const inputRef = useRef(null);
  useEffect(() => {
    const handleShortcut = (e) => {
      if (e.altKey && e.key === 'l') {
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleShortcut);
    return () => {
      window.removeEventListener('keydown', handleShortcut);
    };
  }, []);

  const downloadCSV = async () => {
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


  useEffect(() => {
    if (!query.id) return;

    setTimeout(() => {
      const element = document.getElementById(query.id);
      if (element) {
        console.log("Element found:", element);
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        const iconElement = element.querySelector('.short-link');
        element.classList.add('animate-pulse');
        iconElement.classList.add('animate-spin', 'text-blue-500');

        setTimeout(() => {
          element.classList.remove('animate-pulse');
          iconElement.classList.remove('animate-spin', 'text-blue-500');
          window.history.replaceState(null, '', window.location.pathname);
        }, 2000);
      } else {
        console.log("Element not found with id:", query.id);
      }
    }, 500);
  }, [query.id]);

  return (
    <main className="relative overflow-x-hidden flex flex-col items-center justify-center h-screen font-inter min-h-svh bg-zinc-50 dark:bg-[#09090b]">
      <div className='relative'>
        <GradientTop />
      </div>
      <Nav />

      <div className="relative w-full py-24 overflow-x-hidden">
        <div className="container py-10 mx-auto lg:py-16">

          <header className="relative flex flex-col items-center justify-center w-full mb-10 space-y-10 overflow-hidden">
            <Button variant="outline" className="-mb-8 group" onClick={downloadCSV}>
              <Database className="w-4 h-4 mr-2 group-hover:animate-pulse" /> Export as CSV
            </Button>
            <Button variant="outline" className="-mb-5 group" onClick={refreshData}>
              <RefreshCcw className="w-4 h-4 mr-2 group-hover:animate-spin" /> Refresh Data
            </Button>
            <h1 className="text-4xl font-extrabold tracking-tight scroll-m-20 lg:text-5xl">
              Analytics
            </h1>
            {/* <SearchUrls /> */}
            {/* //! Make this work somehow */}
            <section className="flex items-center p-2 border rounded-lg dark:bg-[#0c0e0f] bg-white">
              <Input
                ref={inputRef}
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by URL..."
                className="flex-grow focus-visible:ring-0 focus-visible:ring-offset-0 dark:bg-[#0c0e0f] border-none"
              />
              <kbd className="p-1 ml-2 mr-2 font-mono text-xs bg-gray-100 rounded ring-1 ring-gray-900/10 dark:bg-zinc-800 dark:ring-gray-900/50 dark:text-zinc-300 whitespace-nowrap">
                ALT<span className="text-[.25rem]">&nbsp;</span>
                +<span className="text-[.25rem]">&nbsp;</span>
                L
              </kbd>
            </section>
          </header>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          {urls.length > 0 ? (
            <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {filteredUrls.map((url) => {
                return (
                  // url._id
                  <li key={url._id} id={url._id} className="p-4 rounded-lg shadow-lg url-card dark:border dark:bg-[#0c0e0f88] dark:backdrop-blur">
                    <header className="flex flex-col gap-0 !text-sm">
                      <h2 className="flex justify-between p-1 space-x-4">
                        <main className="flex items-center ml-1 space-x-4">
                          <Link className="w-5 h-5 short-link" />
                          <a href={url.shortenUrl}
                            target="_blank" rel="noopener noreferrer"
                            className='inline-block px-3 py-1.5 font-mono border rounded-lg text-primary hover:underline'
                          >{url.shortenUrl}</a>
                        </main>
                        <aside className="flex gap-2">
                          <Button type="button" variant="outline" onClick={() => handleCopy(url.shortenUrl)}>
                            <span className="flex w-4 aspect-square">
                              {copiedUrl === url.shortenUrl ? <Check /> : <Copy />}
                            </span>
                          </Button>

                          <img
                            src={`http://www.google.com/s2/favicons?sz=64&domain=${url.originalUrl}`}
                            width="35" height="35"
                            alt="L"
                            className='block rounded aspect-square'
                            loading='lazy'
                          />
                        </aside>
                      </h2>
                      <h2 className="flex justify-between p-1 space-x-4">
                        <main className="flex items-center ml-1 space-x-4">
                          <ExternalLink className="w-5 h-5" />
                          <a href={url.originalUrl}
                            target="_blank" rel="noopener noreferrer"
                            className='inline-block px-3 py-1.5 font-mono border rounded-lg text-primary hover:underline overflow-x-auto max-w-[150px] scrollbar-none whitespace-nowrap'
                          >{url.originalUrl}</a>
                        </main>
                        <aside className="flex gap-2">
                          <Button type="button" variant="outline" onClick={() => { setUrlToDelete(url._id); setOpen(true) }}>
                            <span className="flex w-4 aspect-square">
                              <Trash2 className="text-red-400" />
                            </span>
                          </Button>
                          <Button type="button" variant="outline" onClick={() => { console.log(url); setUrlToEdit(url); setOpenEdit(true) }}>
                            <span className="flex w-4 aspect-square">
                              <Pencil className="text-yellow-600 dark:text-yellow-400" />
                            </span>
                          </Button>
                        </aside>
                      </h2>
                    </header>
                    <section className="flex justify-between gap-2">
                      <article className="flex flex-col my-4 space-y-1 text-sm *:flex *:items-center *:space-x-2">
                        <span className=""><Calendar className="w-4 h-4" /> <span className="text-muted-foreground">{new Date(url.createdAt).toLocaleString()}</span></span>
                        <span className=""><Pencil className="w-4 h-4" /> <span className="text-muted-foreground">{new Date(url.updatedAt).toLocaleString()}</span></span>
                        <span className=""><MousePointerClick className="w-4 h-4" /> <span className="text-muted-foreground">Clicks: {url.accesses.count}</span></span>
                      </article>
                      <aside className="flex flex-col items-end space-y-2">
                        <Button type="button" className="mt-2" variant="outline" onClick={() => handleShowRecents(url)}>
                          <span className="flex">
                            Recents
                          </span>
                        </Button>
                        <div className='flex items-center mt-2 space-x-2'>
                          <Button type="button" variant="outline" onClick={() => handleClickQRCode(url.shortenUrl)}>
                            <span className="flex w-4 aspect-square">
                              <QrCode className="text-gray-600 dark:text-gray-400" />
                            </span>
                          </Button>
                          <Button type="button" className="w-max" variant="outline" onClick={() => { handleOpenGraphDialog(url) }}>
                            <span className="flex w-4 aspect-square">
                              <ChartSpline className="text-green-600 dark:text-green-400" />
                            </span>
                          </Button>
                        </div>
                      </aside>
                    </section>
                    <section className="flex justify-between gap-2">
                      <article className="flex flex-col mb-4 mt-2 space-y-1 text-sm *:flex *:items-center *:space-x-2">
                        <span className="">
                          {
                            new Date(url.expirationDate) < new Date()
                              ? <span className='px-2 py-.5 font-bold rounded-lg bg-red-400/20 small-caps text-red-500/80'>Expired</span>
                              : <span><b>Expiration: </b> <span className="text-muted-foreground">
                                {isNaN(new Date(url.expirationDate).getTime())
                                  ? "Not set"
                                  : new Date(url.expirationDate).toLocaleString()}</span>
                              </span>
                          }
                        </span>
                        <span className="">
                          {
                            new Date(url.scheduledDate) <= new Date()
                              ? <span className='px-2 py-.5 mt-1 font-bold rounded-lg bg-green-400/20 small-caps text-green-500/80'>Live</span>
                              : <span><b>Scheduled: </b><span class="text-muted-foreground">{new Date(url.scheduledDate).toLocaleString()}</span></span>
                          }
                        </span>
                      </article>
                      <aside>
                      </aside>
                    </section>
                  </li>
                )
              })}
            </ul>

          ) : (
            <p>No URLs found</p>
          )}
        </div>
        <DeleteUrlDialog
          open={open}
          setOpen={setOpen}
          urlToDelete={urlToDelete}
          handleDelete={handleDelete}
        />
        <EditUrlDialog
          open={openEdit}
          setOpen={setOpenEdit}
          urlToEdit={urlToEdit}
          handleEdit={handleEdit}
        />
        <QRCodeDialog
          open={openQR}
          setOpen={setOpenQR}
          shortenUrl={urlToQRCode}
        />
        {selectedUrl && (
          <RecentAccessesDialog
            open={openRecents}
            setOpen={setOpenRecents}
            recentAccesses={selectedUrl.accesses.lastAccessed}
          />
        )}
        {selectedUrl && (
          <AccessGraphDialog
            open={openGraphDialog}
            setOpen={setOpenGraphDialog}
            recentAccesses={selectedUrl.accesses.lastAccessed}
          />
        )}
      </div>
    </main>
  );
};