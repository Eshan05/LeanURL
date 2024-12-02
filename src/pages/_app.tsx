import '@styles/index.css'
import { Toaster } from '@components/ui/sonner'

import { Inter, JetBrains_Mono } from 'next/font/google'
import { AppProps } from 'next/app'
import { Suspense } from 'react'
import Image from 'next/image'
const inter = Inter({ subsets: ['latin'] })
export const jetBrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
})

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <main className={inter.className}>
      <Suspense fallback={<Fallback />}>
        <Component {...pageProps} />
      </Suspense>
      <Toaster />
    </main>
  )
}

const Fallback = () => {
  return (
    <div className='flex items-center justify-center w-full h-screen bg-white dark:bg-[#09090b] c-beige:bg-beige-100'>
      <Image src="/images/bars-scale.svg"
        width={20} height={20}
        className="dark:invert"
        alt="..." />
    </div>
  );
}