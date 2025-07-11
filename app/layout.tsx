import type React from "react";
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "../components/ui/sonner";
import { NotchHandler } from "../components/notch-handler";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Mobile Todo App",
  description: "Una aplicación de tareas simple y eficiente",
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  minimumScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning className="mobile-viewport">
      <body
        className={`${inter.className} antialiased overflow-x-hidden hide-scrollbar`}
      >
        <SessionProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <NotchHandler />
            <main>{children}</main>
            <Toaster />
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
