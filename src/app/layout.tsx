import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'GPS Dashboard',
  description: 'GPS Tracking Dashboard',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  if (typeof window !== 'undefined') {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', function() {
        navigator.serviceWorker.register('/service-worker.js').catch(function(err) {
          console.log('ServiceWorker registration failed: ', err);
        });
      });
    }
  }

  return (
    <html lang="pt" suppressHydrationWarning>
      <body className="bg-gray-950" suppressHydrationWarning>
        {children}
      </body>
    </html>
  )
} 