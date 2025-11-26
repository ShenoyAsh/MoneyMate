import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/header";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";
import aj from "@/lib/arcjet";
import { request } from "@arcjet/next";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "MoneyMate",
  description: "One stop Finance Platform",
};

export default async function RootLayout({ children }) {
  // --- Arcjet Security Check ---
  const req = await request();
  const decision = await aj.protect(req);

  if (decision.isDenied()) {
    if (decision.reason.isBot()) {
      return <div>No bots allowed</div>;
    }
    if (decision.reason.isRateLimit()) {
      return <div>Too many requests, please try again later.</div>;
    }
    return <div>Access Denied</div>;
  }
  // -----------------------------

  return (
    // ADDED: suppressHydrationWarning
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/logo-sm.png" sizes="any" />
      </head>
      {/* ADDED: suppressHydrationWarning */}
      <body className={`${inter.className}`} suppressHydrationWarning>
        <ClerkProvider>
          <Header />
          <main className="min-h-screen">{children}</main>
          <Toaster richColors />
          <footer className="bg-blue-50 py-12">
            <div className="container mx-auto px-4 text-center text-gray-600">
              <p>Made with 💗 by Team-8</p>
            </div>
          </footer>
        </ClerkProvider>
      </body>
    </html>
  );
}