import type { Metadata } from 'next'
import { Outfit, Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/ThemeProvider'
import { Toaster } from 'react-hot-toast'
import StructuredData from '@/components/StructuredData'
import GoogleAnalytics from '@/components/GoogleAnalytics'

const outfit = Outfit({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-outfit',
})

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'Free Trial Sentinel - Track & Manage Your Free Trials',
  description: 'Never lose track of your free trials again. Discover, track, and manage all your free trials in one place. Save money and avoid unexpected charges.',
  keywords: ['free trials', 'subscription management', 'trial tracking', 'money saving', 'productivity tools'],
  authors: [{ name: 'Free Trial Sentinel' }],
  creator: 'Free Trial Sentinel',
  publisher: 'Free Trial Sentinel',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://freetrialsentinel.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Free Trial Sentinel - Track & Manage Your Free Trials',
    description: 'Never lose track of your free trials again. Discover, track, and manage all your free trials in one place. Save money and avoid unexpected charges.',
    url: 'https://freetrialsentinel.com',
    siteName: 'Free Trial Sentinel',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Free Trial Sentinel - Track your free trials',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Trial Sentinel - Track & Manage Your Free Trials',
    description: 'Never lose track of your free trials again. Discover, track, and manage all your free trials in one place.',
    images: ['/og-image.png'],
    creator: '@FTsentinel',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
    yahoo: 'your-yahoo-verification-code',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${outfit.variable} ${inter.variable}`} suppressHydrationWarning>
      <head>
        <meta name="web3-domain-verification" content="false" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Prevent MetaMask from injecting and trying to connect
              (function() {
                if (typeof window !== 'undefined') {
                  // Block ethereum object
                  Object.defineProperty(window, 'ethereum', {
                    get: function() { return undefined; },
                    set: function() { return undefined; },
                    configurable: false
                  });
                  
                  // Block web3 object
                  Object.defineProperty(window, 'web3', {
                    get: function() { return undefined; },
                    set: function() { return undefined; },
                    configurable: false
                  });
                  
                  // Prevent MetaMask script injection
                  const originalCreateElement = document.createElement;
                  document.createElement = function(tagName) {
                    const element = originalCreateElement.call(document, tagName);
                    if (tagName.toLowerCase() === 'script') {
                      Object.defineProperty(element, 'src', {
                        get: function() { return this._src; },
                        set: function(value) {
                          if (value && value.includes('metamask')) {
                            this._src = '';
                            return;
                          }
                          this._src = value;
                        }
                      });
                    }
                    return element;
                  };
                }
              })();
            `,
          }}
        />
      </head>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <GoogleAnalytics />
          <StructuredData type="website" />
          <StructuredData type="organization" />
          <Toaster position="top-center" />
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
} 