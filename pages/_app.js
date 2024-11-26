import "../styles/index.css";
import { Toaster } from "../components/ui/sonner"

import { Inter, JetBrains_Mono } from 'next/font/google'
const inter = Inter({ subsets: ['latin'] })
export const jetBrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
})

export default function MyApp({ Component, pageProps }) {
  return (
    <main className={inter.className}>
      <Component {...pageProps} />
      <Toaster />
    </main>
  )
}
