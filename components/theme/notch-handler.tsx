'use client'

import { useTheme } from 'next-themes'
import { useEffect } from 'react'

export function NotchHandler() {
  const { theme, resolvedTheme } = useTheme()

  useEffect(() => {
    const currentTheme = resolvedTheme || theme

    // Colores según el tema
    const colors = {
      light: '#ffffff',
      dark: '#0a0a0a',
    }

    const currentColor =
      colors[currentTheme as keyof typeof colors] || colors.light

    // Actualizar theme-color para el notch
    let metaTag = document.querySelector('meta[name="theme-color"]')
    if (!metaTag) {
      metaTag = document.createElement('meta')
      metaTag.setAttribute('name', 'theme-color')
      document.head.appendChild(metaTag)
    }
    metaTag.setAttribute('content', currentColor)

    // Actualizar el color del documento para el notch
    document.documentElement.style.setProperty('--notch-color', currentColor)

    // Aplicar el color al HTML para el área del notch
    document.documentElement.style.backgroundColor = currentColor
  }, [theme, resolvedTheme])

  return null
}
