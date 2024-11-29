1. You can toggle theme using `CTRL+M` or `CMD+M`
2. In home where you have to put code, the code is fetched from the same collection as where the URLs are but you have to explicitly insert a new document with only field being `q` and the code.
3. Coming to actual share page, the search for URL is for searching existing URL and clicking on the shortened link or hitting entered on currently selected URL will bring to `/analytics` and scroll that link into view. As first only 10 recent URLs are shown and on search you'll fetch all others, there's a debounce which you can shorten
4. If not obvious expiration date is lifetime of link and scheduling is for scheduling it to go live at a certain time
5. In analytics confirm before delete is provided to easily do mass deletes 

The project is in process of migrating to TS, however there are issues currently (Particularly with `shadcn`)