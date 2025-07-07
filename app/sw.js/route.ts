import { NextResponse } from "next/server"

export async function GET() {
  const swCode = `
const CACHE_NAME = "taskflow-v1.0.0"
const STATIC_CACHE_URLS = ["/manifest.json"]

// Install event - cache static assets
self.addEventListener("install", (event) => {
  console.log("🚀 Service Worker: Installing...")

  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        console.log("📦 Service Worker: Caching static assets")
        return cache.addAll(STATIC_CACHE_URLS)
      })
      .then(() => {
        console.log("✅ Service Worker: Installation complete")
        return self.skipWaiting()
      })
      .catch((error) => {
        console.error("❌ Service Worker: Installation failed", error)
      }),
  )
})

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  console.log("🔄 Service Worker: Activating...")

  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              console.log("🗑️ Service Worker: Deleting old cache", cacheName)
              return caches.delete(cacheName)
            }
          }),
        )
      })
      .then(() => {
        console.log("✅ Service Worker: Activation complete")
        return self.clients.claim()
      }),
  )
})

// Fetch event - serve from cache, fallback to network
self.addEventListener("fetch", (event) => {
  // Skip non-GET requests
  if (event.request.method !== "GET") {
    return
  }

  // Skip chrome-extension and other non-http requests
  if (!event.request.url.startsWith("http")) {
    return
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // Return cached version if available
      if (cachedResponse) {
        console.log("📱 Service Worker: Serving from cache", event.request.url)
        return cachedResponse
      }

      // Otherwise fetch from network
      console.log("🌐 Service Worker: Fetching from network", event.request.url)
      return fetch(event.request)
        .then((response) => {
          // Don't cache non-successful responses
          if (!response || response.status !== 200 || response.type !== "basic") {
            return response
          }

          // Clone the response
          const responseToCache = response.clone()

          // Cache the response for future use
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache)
          })

          return response
        })
        .catch((error) => {
          console.error("❌ Service Worker: Fetch failed", error)

          // Return offline page for navigation requests
          if (event.request.destination === "document") {
            return caches.match("/")
          }

          throw error
        })
    }),
  )
})

// Background sync for offline task creation
self.addEventListener("sync", (event) => {
  console.log("🔄 Service Worker: Background sync triggered", event.tag)

  if (event.tag === "background-sync-tasks") {
    event.waitUntil(syncTasks())
  }
})

// Push notification handler
self.addEventListener("push", (event) => {
  console.log("🔔 Service Worker: Push notification received")

  const options = {
    body: event.data ? event.data.text() : "¡Tienes tareas pendientes!",
    icon: "/placeholder.svg?height=192&width=192",
    badge: "/placeholder.svg?height=72&width=72",
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1,
    },
    actions: [
      {
        action: "explore",
        title: "Ver tareas",
      },
      {
        action: "close",
        title: "Cerrar",
      },
    ],
  }

  event.waitUntil(self.registration.showNotification("TaskFlow", options))
})

// Notification click handler
self.addEventListener("notificationclick", (event) => {
  console.log("🔔 Service Worker: Notification clicked", event.action)

  event.notification.close()

  if (event.action === "explore") {
    event.waitUntil(clients.openWindow("/"))
  }
})

// Helper function to sync tasks when back online
async function syncTasks() {
  try {
    console.log("🔄 Service Worker: Syncing tasks...")

    // Get pending tasks from IndexedDB or localStorage
    const pendingTasks = JSON.parse(localStorage.getItem("pendingTasks") || "[]")

    if (pendingTasks.length > 0) {
      // Here you would normally sync with your backend
      console.log("📤 Service Worker: Syncing", pendingTasks.length, "pending tasks")

      // Clear pending tasks after successful sync
      localStorage.removeItem("pendingTasks")

      // Notify the main app about successful sync
      const clients = await self.clients.matchAll()
      clients.forEach((client) => {
        client.postMessage({
          type: "TASKS_SYNCED",
          data: pendingTasks,
        })
      })
    }

    console.log("✅ Service Worker: Task sync complete")
  } catch (error) {
    console.error("❌ Service Worker: Task sync failed", error)
  }
}
`

  return new NextResponse(swCode, {
    headers: {
      "Content-Type": "application/javascript",
      "Cache-Control": "public, max-age=0, must-revalidate",
      "Service-Worker-Allowed": "/",
    },
  })
}
