import './globals.css'
import { Inter, Caveat, Nunito } from 'next/font/google'
import Header from '../components/Header';

export const metadata = {
  title: 'Saint Works',
  description: 'Artist, Developer, Boise Idaho',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
}

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--inter',
  display: 'swap'
})

const caveat = Caveat({
  variable: "--caveat",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

const nunito = Nunito({
  variable: "--nunito",
  subsets: ["latin"],
  weight: ["300", "400", "600"],
  style: ["normal"],
  display: "swap",
});

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${caveat.variable} ${nunito.variable}`}>
        <Header />
        {children}
      </body>
    </html>
  )
}
