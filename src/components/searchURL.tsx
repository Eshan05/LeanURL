import Link from "next/link";
import { useRouter } from "next/router";
import { useCallback, useMemo, useState, useEffect } from "react";
import {
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
  CommandDialog
} from "@components/ui/command";
import { DialogDescription, DialogTitle } from "@components/ui/dialog";
import { Input } from "@components/ui/input";
import { SearchIcon, LinkIcon, ExternalLinkIcon } from "lucide-react";
import { URLDocument } from "@/types/types";

const SearchUrls = () => {
  const [error, setError] = useState<string>('');
  const [urls, setUrls] = useState<URLDocument[]>([]);
  const [open, setOpen] = useState<boolean>(false);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>(''); // This holds the final search query
  const [inputValue, setInputValue] = useState<string>('');   // This holds the input field value for instant typing
  const [debouncedQuery, setDebouncedQuery] = useState<string>(searchQuery); // This holds the debounced search query
  const router = useRouter();

  const fetchUrls = async (searchQuery: string = '') => {
    try {
      const query = searchQuery ? `?search=${searchQuery}` : ''; // Append search query if present
      const res = await fetch(`/api/searchDialogPages${query}`);
      const data: URLDocument[] = await res.json();
      setUrls(data);
    } catch (error) {
      setError('Failed to fetch URLs');
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(inputValue);
    }, 500);

    return () => clearTimeout(timer);  // Clean up the timer on component unmount or before the next input change
  }, [inputValue]);

  // Fetch URLs whenever the debounced query changes
  useEffect(() => {
    setSearchQuery(debouncedQuery);
  }, [debouncedQuery]);

  // Fetch URLs whenever the final search query changes
  useEffect(() => {
    fetchUrls(searchQuery);
  }, [searchQuery]);

  // Handle changes in the search input field
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);  // Instant typing updates inputValue
  };


  const filteredUrls = useMemo(() =>
    urls.filter((url) =>
      url.originalUrl.toLowerCase().includes(searchQuery.toLowerCase()) ||
      url.shortenUrl.toLowerCase().includes(searchQuery.toLowerCase())
    ), [urls, searchQuery]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === "Enter" && filteredUrls.length > 0) {
      const selectedUrl = filteredUrls[selectedIndex];
    }

    if (e.key === "k" && (e.metaKey || e.ctrlKey || e.altKey)) {
      e.preventDefault();
      setOpen((prev: boolean) => !prev);
    }
  }, [filteredUrls, selectedIndex]);

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [filteredUrls, selectedIndex, handleKeyDown]);

  return (
    // @ts-ignore
    <CommandDialog open={open} onOpenChange={setOpen} className="border rounded-lg max-w-3/4 lg:w-1/4">
      <DialogTitle className="hidden"></DialogTitle>
      <DialogDescription className="hidden"></DialogDescription>
      {/* <CommandInput
        placeholder="Search for a link..."
        onChange={handleSearchChange}
        value={inputValue}
        className="px-4 pb-2 "
      /> */}
      <div className="flex items-center px-3 pb-1 border-b c-beige:bg-beige-50" cmdk-input-wrapper="">
        <SearchIcon className="w-4 h-4 mr-2 opacity-50 shrink-0" />
        <Input
          className={
            "flex h-11 w-full rounded-md bg-transparent py-3 px-4 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 border-none focus-visible:ring-0 focus-visible:ring-offset-0"}
          placeholder="Search for a link..."
          value={inputValue}
          onChange={handleSearchChange}
        />
      </div>
      <CommandList className="px-2 py-4 c-beige:bg-beige-50">
        {urls.length === 0 ? (
          <CommandEmpty>{error ? error : "No URLs found"}</CommandEmpty>
        ) : (
          <CommandGroup heading={searchQuery ? "Search Results" : "Recent URLs"}>
            {filteredUrls.map((url, index) => (
              <CommandItem
                key={index}
                onSelect={() => { router.push(`/analytics?id=${url._id}`); }}
                className="border-b last:border-b-0">
                <article className="flex items-center gap-2 p-1 space-x-1">
                  <img
                    src={`http://www.google.com/s2/favicons?sz=64&domain=${url.originalUrl}`}
                    width="32" height="32"
                    alt="L" loading="lazy"
                    className='block rounded aspect-square'
                  />
                  <section className="flex flex-col space-y-2">
                    <main className="flex items-center space-x-3 font-mono">
                      <ExternalLinkIcon className="w-4 h-4" />
                      <a
                        href={url.originalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-normal hover:text-blue-400 hover:underline">
                        {url.originalUrl.replace(/^https?:\/\//, '')}</a>
                    </main>
                    <div className="flex items-center space-x-3 font-mono text-muted-foreground">
                      <LinkIcon className="w-4 h-4" />
                      <Link
                        href={`/analytics?id=${url._id}`} passHref
                        target="_blank" className="text-[.75rem] hover:underline">
                        {url.shortenUrl} </Link>
                    </div>
                  </section>
                </article>
              </CommandItem>
            ))}
          </CommandGroup>
        )}
      </CommandList>
    </CommandDialog>
  );
};

export default SearchUrls;
