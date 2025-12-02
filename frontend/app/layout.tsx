import type { Metadata } from "next";
import { Manrope, Inter, JetBrains_Mono } from "next/font/google";
import Link from "next/link";
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
            <div className="max-w-7xl mx-auto px-6">
              <div className="flex items-center justify-between h-16">
                <div className="flex items-center gap-4">
                  <Link href="/" className="flex items-center gap-3 group">
                    <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
                      <span className="text-white font-bold text-lg">P</span>
                    </div>
                    <span className="text-xl font-semibold text-slate-900 tracking-tight">PrivyLend</span>
                  </Link>
                  {USE_MOCK_DATA && (
                    <span className="px-2.5 py-1 text-xs font-medium bg-amber-50 text-amber-700 rounded-md border border-amber-200">
                      Demo Mode
                    </span>
                  )}
                </div>
                <div className="flex gap-1 bg-slate-100 rounded-lg p-1">
                  <Link 
                    href="/" 
                    className="px-4 py-2 rounded-md text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-white transition-colors"
                  >
                    Dashboard
                  </Link>
                  <Link 
                    href="/deposit" 
                    className="px-4 py-2 rounded-md text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-white transition-colors"
                  >
                    Deposit
                  </Link>
                  <Link 
                    href="/borrow" 
                    className="px-4 py-2 rounded-md text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-white transition-colors"
                  >
                    Borrow
                  </Link>
                  <Link 
                    href="/loans" 
                    className="px-4 py-2 rounded-md text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-white transition-colors"
                  >
                    My Loans
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
            <div className="max-w-7xl mx-auto px-6 py-8">
              <div className="text-center">
                <p className="text-slate-600 font-medium">
                  PrivyLend - Privacy-Preserving Compliant Lending on Canton
                </p>
                {USE_MOCK_DATA && (
                  <p className="text-xs mt-2 text-slate-500">
                    Demo Mode: Using mock data • Production-ready Canton integration available
                  </p>
                )}
                <div className="flex justify-center gap-6 mt-4 text-sm text-slate-500">
                  <a href="#" className="hover:text-slate-900 transition-colors">Documentation</a>
                  <a href="#" className="hover:text-slate-900 transition-colors">GitHub</a>
                  <a href="#" className="hover:text-slate-900 transition-colors">Canton Network</a>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
