import type { Metadata } from "next";
import { Manrope, Inter, JetBrains_Mono } from "next/font/google";
import Link from "next/link";
import Image from "next/image";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "PrivyLend - Privacy-Preserving Lending Protocol",
  description: "Decentralized lending with privacy and compliance",
  icons: {
    icon: "/privylend-logo.svg",
    apple: "/privylend-logo.svg",
  },
};

const USE_MOCK_DATA = process.env.NEXT_PUBLIC_USE_MOCK_DATA !== 'false';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${manrope.variable} ${inter.variable} ${jetbrainsMono.variable} antialiased`}
      >
        <div className="min-h-screen bg-slate-50">
          {/* Professional Navigation */}
          <nav className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
              <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-2 sm:gap-4">
                <Link href="/" className="flex items-center gap-2 sm:gap-3 group">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Image 
                      src="/privylend-logo.svg" 
                      alt="PrivyLend Logo" 
                      width={40} 
                      height={40}
                      className="w-full h-full"
                      priority
                    />
                  </div>
                  <span className="text-lg sm:text-xl font-semibold text-slate-900 tracking-tight">PrivyLend</span>
                  </Link>
                  {USE_MOCK_DATA && (
                    <span className="hidden sm:inline-block px-2.5 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-md border border-yellow-200">
                      Demo Mode
                    </span>
                  )}
                  {!USE_MOCK_DATA && (
                    <span className="hidden sm:inline-block px-2.5 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-md border border-green-200">
                      Production Mode
                    </span>
                  )}
                </div>
                <div className="flex gap-0.5 sm:gap-1 bg-slate-100 rounded-lg p-0.5 sm:p-1">
                  <Link 
                    href="/" 
                    className="px-2 sm:px-4 py-1.5 sm:py-2 rounded-md text-xs sm:text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-white transition-colors"
                  >
                    <span className="hidden sm:inline">Dashboard</span>
                    <span className="sm:hidden">Home</span>
                  </Link>
                  <Link 
                    href="/deposit" 
                    className="px-2 sm:px-4 py-1.5 sm:py-2 rounded-md text-xs sm:text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-white transition-colors"
                  >
                    Deposit
                  </Link>
                  <Link 
                    href="/borrow" 
                    className="px-2 sm:px-4 py-1.5 sm:py-2 rounded-md text-xs sm:text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-white transition-colors"
                  >
                    Borrow
                  </Link>
                  <Link 
                    href="/loans" 
                    className="px-2 sm:px-4 py-1.5 sm:py-2 rounded-md text-xs sm:text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-white transition-colors"
                  >
                    <span className="hidden sm:inline">My Loans</span>
                    <span className="sm:hidden">Loans</span>
                  </Link>
                </div>
              </div>
            </div>
          </nav>

          {/* Main Content */}
          <main className="max-w-7xl mx-auto px-6 py-8">
            {children}
          </main>

          {/* Professional Footer */}
          <footer className="mt-16 border-t border-slate-200 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
              <div className="text-center">
                <p className="text-slate-600 font-medium text-sm sm:text-base">
                  PrivyLend - Privacy-Preserving Compliant Lending on Canton
                </p>
                <p className="mt-4 text-sm text-slate-600">
                  Built with ❤️ for <span className="font-semibold text-blue-600">Canton Construct Ideathon</span>
                </p>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
