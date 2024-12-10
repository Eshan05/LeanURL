```shell
 pnpm lint

> qr-code-generator@2.0.0 lint
> next lint

✔ No ESLint warnings or errors
 pnpm lint-ts

> qr-code-generator@2.0.0 lint-ts
> tsc --noEmit

 pnpm build

> qr-code-generator@2.0.0 build
> next build

   ▲ Next.js 15.0.3
   - Environments: .env

 ✓ Linting and checking validity of types 
   Creating an optimized production build ...
 ✓ Compiled successfully
 ✓ Collecting page data    
 ✓ Generating static pages (6/6)
 ✓ Collecting build traces    
 ✓ Finalizing page optimization

Route (pages)                              Size     First Load JS
┌ ○ / (1267 ms)                            2 kB            104 kB
├   /_app                                  0 B              93 kB
├ ƒ /[shortUrl]                            278 B          93.3 kB
├ ○ /404                                   190 B          93.2 kB
├ ○ /analytics (1352 ms)                   6.69 kB         188 kB
├ ƒ /api/analytics                         0 B              93 kB
├ ƒ /api/authenticate                      0 B              93 kB
├ ƒ /api/csvAnalytics                      0 B              93 kB
├ ƒ /api/searchDialogPages                 0 B              93 kB
├ ƒ /api/shorten                           0 B              93 kB
├ ○ /graphs (1352 ms)                      5.05 kB         186 kB
└ ○ /share (1353 ms)                       3.87 kB         185 kB
+ First Load JS shared by all              102 kB
  ├ chunks/framework-f8635397dd7e19a9.js   44.8 kB
  ├ chunks/main-4ce0500121fde1df.js        33.2 kB
  ├ chunks/pages/_app-1c0a6bdbaa5d91d3.js  13.3 kB
  └ other shared chunks (total)            10.8 kB

○  (Static)   prerendered as static content
ƒ  (Dynamic)  server-rendered on demand
```