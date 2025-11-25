import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/header";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";
import aj from "@/lib/arcjet"; // Import Arcjet
import { request } from "@arcjet/next"; // Import request helper

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "MoneyMate",
  description: "One stop Finance Platform",
};

export default async function RootLayout({ children }) {
  // --- Arcjet Security Check ---
  // This runs on the server, avoiding the middleware size limit
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
    <ClerkProvider>
      <html lang="en">
        {/* ... rest of your layout code ... */}
        <head>
          <link rel="icon" href="/logo-sm.png" sizes="any" />
        </head>
        <body className={`${inter.className}`}>
          <Header />
          <main className="min-h-screen">{children}</main>
          <Toaster richColors />
          <footer className="bg-blue-50 py-12">
            <div className="container mx-auto px-4 text-center text-gray-600">
              <p>Made with 💗 by Team-8</p>
            </div>
          </footer>
        </body>
      </html>
    </ClerkProvider>
  );
}