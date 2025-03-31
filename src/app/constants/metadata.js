export const metadata = {
    title: 'Joe St.Romain | Artist & Developer | SaintWorks',
    description: 'Art and oddities out of Boise, Idaho. Combining studio art, web development, and business solutions at SaintWorks.',
    viewport: 'width=device-width, initial-scale=1, maximum-scale=5',
    keywords: 'artist, developer, consultant, Boise, Idaho, web development, studio art, SaintWorks',
    authors: [{ name: 'Joe St.Romain' }],
    creator: 'Joe St.Romain',
    publisher: 'SaintWorks',
    openGraph: {
      title: 'Joe St.Romain | Artist & Developer',
      description: 'Art and oddities out of Boise, Idaho. Combining studio art, web development, and business solutions.',
      url: 'https://www.saintworks.com',
      siteName: 'SaintWorks',
      locale: 'en_US',
      type: 'website',
      images: [
        {
          url: '/images/profile_picture.jpg',
          width: 1200,
          height: 630,
          alt: 'Joe St.Romain - Artist & Developer',
        }
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Joe St.Romain | Artist & Developer',
      description: 'Art and oddities out of Boise, Idaho.',
      images: ['/images/profile_picture.jpg'],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
      },
    },
    metadataBase: new URL('https://www.saintworks.com'),
  }