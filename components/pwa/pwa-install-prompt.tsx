"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Download, X, Smartphone, Share, Plus, ArrowUp } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSInstructions, setShowIOSInstructions] = useState(false);

  useEffect(() => {
    // Check if app is already installed
    const checkIfInstalled = () => {
      if (window.matchMedia("(display-mode: standalone)").matches) {
        setIsInstalled(true);
        return;
      }

      if ((window.navigator as any).standalone === true) {
        setIsInstalled(true);
        return;
      }

      if (document.referrer.includes("android-app://")) {
        setIsInstalled(true);
        return;
      }

      // Check if it's iOS
      const isIOSDevice =
        /iPad|iPhone|iPod/.test(navigator.userAgent) &&
        !(window as any).MSStream;
      const isSafari =
        /Safari/.test(navigator.userAgent) &&
        !/Chrome/.test(navigator.userAgent);
      setIsIOS(isIOSDevice && isSafari); // Only show for Safari on iOS

      // Check if it's already installed on iOS (standalone mode)
      if (isIOSDevice && (window.navigator as any).standalone === true) {
        setIsInstalled(true);
        return;
      }
    };

    checkIfInstalled();

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);

      // Show install prompt after a delay
      setTimeout(() => {
        if (!isInstalled) {
          setShowInstallPrompt(true);
        }
      }, 3000);
    };

    // For iOS devices, show install prompt even without beforeinstallprompt event
    const handleIOSInstallPrompt = () => {
      if (
        isIOS &&
        !isInstalled &&
        !sessionStorage.getItem("installPromptDismissed")
      ) {
        setTimeout(() => {
          setShowInstallPrompt(true);
        }, 3000);
      }
    };

    if (isIOS) {
      handleIOSInstallPrompt();
    }

    // Listen for app installed event
    const handleAppInstalled = () => {
      console.log("🎉 PWA: App installed successfully");
      setIsInstalled(true);
      setShowInstallPrompt(false);
      setDeferredPrompt(null);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, [isInstalled]);

  const handleInstallClick = async () => {
    if (isIOS) {
      // For iOS, show instructions instead of trying to prompt
      setShowIOSInstructions(true);
      return;
    }

    if (!deferredPrompt) return;

    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;

      if (outcome === "accepted") {
        console.log("✅ PWA: User accepted the install prompt");
      } else {
        console.log("❌ PWA: User dismissed the install prompt");
      }

      setDeferredPrompt(null);
      setShowInstallPrompt(false);
    } catch (error) {
      console.error("❌ PWA: Install prompt failed", error);
    }
  };

  const handleDismiss = () => {
    setShowInstallPrompt(false);
    setShowIOSInstructions(false);
    // Don't show again for this session
    sessionStorage.setItem("installPromptDismissed", "true");
  };

  // Don't show if already installed or dismissed
  if (isInstalled || !showInstallPrompt) {
    return null;
  }

  // For non-iOS devices, require deferredPrompt
  if (!isIOS && !deferredPrompt) {
    return null;
  }

  // Don't show if dismissed in this session
  if (sessionStorage.getItem("installPromptDismissed")) {
    return null;
  }

  // Render iOS instructions modal
  if (showIOSInstructions) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <Card className="max-w-sm w-full border-0 shadow-2xl rounded-2xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-xl">Instalar en iOS</h3>
              <Button
                onClick={handleDismiss}
                size="icon"
                variant="ghost"
                className="h-8 w-8"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-muted rounded-xl">
                <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                  <Share className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">1. Toca el botón Compartir</p>
                  <p className="text-sm text-muted-foreground">
                    En la parte inferior de Safari
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-muted rounded-xl">
                <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                  <Plus className="w-5 h-5 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">2. Añadir a pantalla inicio</p>
                  <p className="text-sm text-muted-foreground">
                    Busca esta opción en el menú
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-muted rounded-xl">
                <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                  <ArrowUp className="w-5 h-5 text-purple-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">3. Confirmar instalación</p>
                  <p className="text-sm text-muted-foreground">
                    Toca "Añadir" para completar
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t">
              <p className="text-sm text-muted-foreground text-center">
                Una vez instalada, podrás acceder a TaskFlow desde tu pantalla
                de inicio como una app nativa
              </p>
              <p className="text-xs text-muted-foreground text-center mt-2">
                ℹ️ Estas instrucciones son solo para Safari
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:max-w-sm">
      <Card className="border-0 shadow-2xl rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 dark:from-purple-600 dark:to-pink-600 text-white">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-white/20 rounded-xl">
              <Smartphone className="w-6 h-6" />
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-lg mb-1">¡Instala TaskFlow!</h3>
              <p className="text-sm text-white/90 mb-3">
                {isIOS
                  ? "Añádela a tu pantalla de inicio para acceso rápido sin conexión"
                  : "Accede más rápido y úsala sin conexión. ¡Como una app nativa!"}
              </p>

              <div className="flex gap-2">
                <Button
                  onClick={handleInstallClick}
                  size="sm"
                  className="bg-white text-purple-600 hover:bg-white/90 font-semibold rounded-xl"
                >
                  {isIOS ? (
                    <>
                      <Share className="w-4 h-4 mr-2" />
                      Ver instrucciones
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4 mr-2" />
                      Instalar
                    </>
                  )}
                </Button>

                <Button
                  onClick={handleDismiss}
                  size="sm"
                  variant="ghost"
                  className="text-white hover:bg-white/20 rounded-xl"
                >
                  Ahora no
                </Button>
              </div>
            </div>

            <Button
              onClick={handleDismiss}
              size="icon"
              variant="ghost"
              className="h-8 w-8 text-white hover:bg-white/20 rounded-lg"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
