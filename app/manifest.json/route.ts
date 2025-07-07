import { NextResponse } from "next/server"

export async function GET() {
  const manifest = {
    name: "TaskFlow - Gestor de Tareas",
    short_name: "TaskFlow",
    description: "Organiza tu vida de manera inteligente con TaskFlow, tu gestor de tareas personal",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#8b5cf6",
    orientation: "portrait-primary",
    categories: ["productivity", "utilities"],
    lang: "es",
    dir: "ltr",
    icons: [
      {
        src: "/placeholder.svg?height=72&width=72",
        sizes: "72x72",
        type: "image/svg+xml",
        purpose: "maskable any",
      },
      {
        src: "/placeholder.svg?height=96&width=96",
        sizes: "96x96",
        type: "image/svg+xml",
        purpose: "maskable any",
      },
      {
        src: "/placeholder.svg?height=128&width=128",
        sizes: "128x128",
        type: "image/svg+xml",
        purpose: "maskable any",
      },
      {
        src: "/placeholder.svg?height=144&width=144",
        sizes: "144x144",
        type: "image/svg+xml",
        purpose: "maskable any",
      },
      {
        src: "/placeholder.svg?height=152&width=152",
        sizes: "152x152",
        type: "image/svg+xml",
        purpose: "maskable any",
      },
      {
        src: "/placeholder.svg?height=192&width=192",
        sizes: "192x192",
        type: "image/svg+xml",
        purpose: "maskable any",
      },
      {
        src: "/placeholder.svg?height=384&width=384",
        sizes: "384x384",
        type: "image/svg+xml",
        purpose: "maskable any",
      },
      {
        src: "/placeholder.svg?height=512&width=512",
        sizes: "512x512",
        type: "image/svg+xml",
        purpose: "maskable any",
      },
    ],
    shortcuts: [
      {
        name: "Nueva Tarea",
        short_name: "Nueva",
        description: "Crear una nueva tarea rápidamente",
        url: "/?action=new-task",
        icons: [
          {
            src: "/placeholder.svg?height=96&width=96",
            sizes: "96x96",
          },
        ],
      },
      {
        name: "Tareas Pendientes",
        short_name: "Pendientes",
        description: "Ver tareas pendientes",
        url: "/?tab=pending",
        icons: [
          {
            src: "/placeholder.svg?height=96&width=96",
            sizes: "96x96",
          },
        ],
      },
    ],
    related_applications: [],
    prefer_related_applications: false,
  }

  return NextResponse.json(manifest, {
    headers: {
      "Content-Type": "application/manifest+json",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  })
}
