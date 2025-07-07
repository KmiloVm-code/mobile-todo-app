import type React from "react";
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { AuthProvider } from "../context/auth-context";
import { ThemeProvider } from "../context/theme-provider";
import { Toaster } from "../components/ui/sonner";
import PWAManager from "../components/pwa/pwa-manager";
import PWAInstallPrompt from "../components/pwa/pwa-install-prompt";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TaskFlow - Gestor de Tareas",
  description:
    "Organiza tu vida de manera inteligente con TaskFlow, tu gestor de tareas personal",
  keywords: [
    "tareas",
    "productividad",
    "organización",
    "gestión",
    "todo",
    "pwa",
  ],
  authors: [{ name: "TaskFlow Team" }],
  creator: "TaskFlow",
  publisher: "TaskFlow",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "TaskFlow",
  },
  openGraph: {
    type: "website",
    siteName: "TaskFlow",
    title: "TaskFlow - Gestor de Tareas",
    description: "Organiza tu vida de manera inteligente",
  },
  twitter: {
    card: "summary_large_image",
    title: "TaskFlow - Gestor de Tareas",
    description: "Organiza tu vida de manera inteligente",
  },
  icons: {
    icon: [
      {
        url: "/placeholder.svg?height=32&width=32",
        sizes: "32x32",
        type: "image/svg+xml",
      },
      {
        url: "/placeholder.svg?height=16&width=16",
        sizes: "16x16",
        type: "image/svg+xml",
      },
    ],
    apple: [
      {
        url: "/placeholder.svg?height=180&width=180",
        sizes: "180x180",
        type: "image/svg+xml",
      },
    ],
  },
  generator: "v0.dev",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#8b5cf6" },
    { media: "(prefers-color-scheme: dark)", color: "#8b5cf6" },
  ],
  width: "device-width",
  initialScale: 1,
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
    <html lang="es">
      <head>
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="TaskFlow" />
        <meta name="application-name" content="TaskFlow" />
        <meta name="msapplication-TileColor" content="#8b5cf6" />
        <link rel="shortcut icon" href="/placeholder.svg?height=32&width=32" />
      </head>
      <body className={inter.className}>
        <ThemeProvider>
          <AuthProvider>
            <PWAManager />
            {children}
            <PWAInstallPrompt />
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
