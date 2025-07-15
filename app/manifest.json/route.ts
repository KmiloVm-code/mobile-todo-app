import { NextResponse } from 'next/server'

export async function GET() {
  const manifest = {
    name: 'TaskFlow',
    short_name: 'TaskFlow',
    description: 'Una aplicación de tareas simple y eficiente',
    start_url: '/',
    display: 'standalone',
    orientation: 'portrait-primary',
    categories: ['productivity', 'utilities'],
    lang: 'es',
    dir: 'ltr',
    scope: '/',
    icons: [
      {
        src: '/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any maskable',
      },
      {
        src: '/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any maskable',
      },
    ],
  }

  return NextResponse.json(manifest, {
    headers: {
      'Content-Type': 'application/manifest+json',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  })
}
