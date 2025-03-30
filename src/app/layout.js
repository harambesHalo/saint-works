import './globals.css'
import { Inter, Euphoria_Script, Nunito } from 'next/font/google'
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

const euphoria = Euphoria_Script({
  variable: "--euphoria",
  subsets: ["latin"],
  weight: ["400"], // Euphoria Script only supports weight 400
  display: "swap",
});

const nunito = Nunito({
  variable: "--nunito", // Define a variable for Nunito
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
  display: "swap",
});

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${euphoria.variable} ${nunito.variable}`}>
        <Header />
        {children}
      </body>
    </html>
  )
}
