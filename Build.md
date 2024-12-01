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
 ✓ Generating static pages (5/5)
 ✓ Collecting build traces    
 ✓ Finalizing page optimization

Route (pages)                             Size     First Load JS
┌ ○ / (1172 ms)                           1.99 kB         104 kB
├   /_app                                 0 B            89.2 kB
├ ƒ /[shortUrl]                           278 B          89.5 kB
├ ○ /404                                  190 B          89.4 kB
├ ○ /analytics (1248 ms)                  13.5 kB         174 kB
├ ƒ /api/analytics                        0 B            89.2 kB
├ ƒ /api/authenticate                     0 B            89.2 kB
├ ƒ /api/csvAnalytics                     0 B            89.2 kB
├ ƒ /api/searchDialogPages                0 B            89.2 kB
├ ƒ /api/shorten                          0 B            89.2 kB
└ ○ /share (1247 ms)                      16 kB           177 kB
+ First Load JS shared by all             97.6 kB
  ├ chunks/framework-f8635397dd7e19a9.js  44.8 kB
  ├ chunks/main-4ce0500121fde1df.js       33.2 kB
  └ other shared chunks (total)           19.6 kB

○  (Static)   prerendered as static content
ƒ  (Dynamic)  server-rendered on demand
```