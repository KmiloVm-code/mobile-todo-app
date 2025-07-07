/**
 * Tipos relacionados con temas y apariencia
 */

/** Tema de la aplicación */
export type Theme = 'light' | 'dark' | 'system'

/** Tema resuelto (sin sistema) */
export type ResolvedTheme = 'light' | 'dark'

/** Contexto de tema */
export interface ThemeContextType {
  theme: Theme
  resolvedTheme: ResolvedTheme
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
}

/** Configuración de tema personalizado */
export interface CustomTheme {
  name: string
  colors: {
    primary: string
    secondary: string
    accent: string
    background: string
    foreground: string
    muted: string
    border: string
    input: string
    ring: string
    destructive: string
    success: string
    warning: string
  }
  fonts?: {
    sans: string[]
    mono: string[]
  }
  spacing?: Record<string, string>
  borderRadius?: Record<string, string>
}

/** Preferencias de apariencia */
export interface AppearancePreferences {
  theme: Theme
  colorScheme?: string
  fontSize: 'sm' | 'base' | 'lg' | 'xl'
  reducedMotion: boolean
  highContrast: boolean
  customTheme?: CustomTheme
}

/** Estado del proveedor de tema */
export interface ThemeProviderState {
  theme: Theme
  resolvedTheme: ResolvedTheme
  systemTheme: ResolvedTheme
  isLoading: boolean
}
