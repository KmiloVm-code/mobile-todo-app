"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/auth-context";

// Type definitions for Background Sync API (not in standard TypeScript libs)
interface SyncManager {
  register(tag: string): Promise<void>;
  getTags(): Promise<string[]>;
}

// Extend ServiceWorkerRegistration with background sync support
interface ServiceWorkerRegistrationWithSync extends ServiceWorkerRegistration {
  sync?: SyncManager;
}

export default function PWAManager() {
  const { user } = useAuth();
  const [isOnline, setIsOnline] = useState(true);
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [swRegistration, setSwRegistration] =
    useState<ServiceWorkerRegistrationWithSync | null>(null);

  useEffect(() => {
    // Register service worker
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          console.log("✅ PWA: Service Worker registered", registration.scope);
          setSwRegistration(registration as ServiceWorkerRegistrationWithSync);

          // Check for updates
          registration.addEventListener("updatefound", () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener("statechange", () => {
                if (
                  newWorker.state === "installed" &&
                  navigator.serviceWorker.controller
                ) {
                  console.log("🔄 PWA: New version available");
                  setUpdateAvailable(true);
                }
              });
            }
          });
        })
        .catch((error: Error) => {
          console.error("❌ PWA: Service Worker registration failed", error);
        });

      // Listen for service worker messages
      navigator.serviceWorker.addEventListener(
        "message",
        (event: MessageEvent) => {
          try {
            if (event.data?.type === "TASKS_SYNCED") {
              console.log("✅ PWA: Tasks synced successfully");
              // You could show a toast notification here
            }
          } catch (error) {
            console.error(
              "❌ PWA: Error handling service worker message",
              error
            );
          }
        }
      );
    }

    // Monitor online/offline status
    const handleOnline = () => {
      console.log("🌐 PWA: Back online");
      setIsOnline(true);

      // Trigger background sync when back online (only if supported)
      if (swRegistration) {
        try {
          // Check if Background Sync API is supported
          if ("sync" in swRegistration) {
            const registrationWithSync =
              swRegistration as ServiceWorkerRegistrationWithSync;

            if (registrationWithSync.sync) {
              registrationWithSync.sync
                .register("background-sync-tasks")
                .catch((error: Error) => {
                  console.error(
                    "❌ PWA: Background sync registration failed",
                    error
                  );
                });
            }
          } else {
            console.log("ℹ️ PWA: Background Sync API not supported");
          }
        } catch (error) {
          console.error("❌ PWA: Error accessing background sync", error);
        }
      }
    };

    const handleOffline = () => {
      console.log("📱 PWA: Gone offline");
      setIsOnline(false);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Set initial online status
    setIsOnline(navigator.onLine);

    // Request notification permission if user is logged in
    if (user && "Notification" in window) {
      if (Notification.permission === "default") {
        Notification.requestPermission()
          .then((permission: NotificationPermission) => {
            if (permission === "granted") {
              console.log("✅ PWA: Notification permission granted");
            } else if (permission === "denied") {
              console.log("❌ PWA: Notification permission denied");
            } else {
              console.log("ℹ️ PWA: Notification permission dismissed");
            }
          })
          .catch((error: Error) => {
            console.error(
              "❌ PWA: Error requesting notification permission",
              error
            );
          });
      } else {
        console.log(
          `ℹ️ PWA: Notification permission already ${Notification.permission}`
        );
      }
    }

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [user, swRegistration]);

  const handleUpdate = () => {
    try {
      if (swRegistration && swRegistration.waiting) {
        swRegistration.waiting.postMessage({ type: "SKIP_WAITING" });
        console.log("🔄 PWA: Triggering service worker update");
        // Small delay to ensure the message is processed before reload
        setTimeout(() => {
          window.location.reload();
        }, 100);
      }
    } catch (error) {
      console.error("❌ PWA: Error updating service worker", error);
      // Fallback: still try to reload
      window.location.reload();
    }
  };

  // Show offline indicator
  if (!isOnline) {
    return (
      <div className="fixed top-0 left-0 right-0 bg-amber-500 text-white text-center py-2 text-sm font-medium z-50">
        📱 Modo sin conexión - Los cambios se sincronizarán cuando vuelvas a
        estar online
      </div>
    );
  }

  // Show update available notification
  if (updateAvailable) {
    return (
      <div className="fixed top-0 left-0 right-0 bg-blue-500 text-white text-center py-2 text-sm font-medium z-50">
        🔄 Nueva versión disponible -{" "}
        <button onClick={handleUpdate} className="underline font-semibold">
          Actualizar ahora
        </button>
      </div>
    );
  }

  return null;
}
