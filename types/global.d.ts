/**
 * Declaraciones de tipos globales y extensiones
 */

import type { ComponentPropsWithoutRef, ElementRef } from 'react'

// Extensiones de tipos globales
declare global {
  // Variables de entorno tipadas
  namespace NodeJS {
    interface ProcessEnv {
      readonly NODE_ENV: 'development' | 'production' | 'test'
      readonly NEXT_PUBLIC_APP_URL: string
      readonly NEXT_PUBLIC_API_URL: string
      readonly DATABASE_URL?: string
      readonly JWT_SECRET?: string
      readonly NEXTAUTH_SECRET?: string
      readonly NEXTAUTH_URL?: string
    }
  }

  // Extensión de window para PWA
  interface Window {
    workbox: {
      readonly registration: ServiceWorkerRegistration | undefined
      readonly active: ServiceWorker | undefined
      readonly ready: Promise<ServiceWorkerRegistration>
    }
    gtag: (...args: unknown[]) => void
    // Service Worker
    __WB_MANIFEST: unknown
    // Analytics
    dataLayer: unknown[]
  }

  // Tipos para módulos CSS
  declare module '*.module.css' {
    const classes: { readonly [key: string]: string }
    export default classes
  }

  declare module '*.module.scss' {
    const classes: { readonly [key: string]: string }
    export default classes
  }

  // Tipos para archivos estáticos
  declare module '*.svg' {
    const content: React.FunctionComponent<React.SVGAttributes<SVGElement>>
    export default content
  }

  declare module '*.svg?url' {
    const content: string
    export default content
  }

  declare module '*.png' {
    const content: string
    export default content
  }

  declare module '*.jpg' {
    const content: string
    export default content
  }

  declare module '*.jpeg' {
    const content: string
    export default content
  }

  declare module '*.gif' {
    const content: string
    export default content
  }

  declare module '*.webp' {
    const content: string
    export default content
  }

  declare module '*.ico' {
    const content: string
    export default content
  }

  declare module '*.bmp' {
    const content: string
    export default content
  }
}

// Utilidades de tipos para componentes React
export type ComponentRef<
  T extends keyof JSX.IntrinsicElements | React.JSXElementConstructor<unknown>,
> = T extends keyof JSX.IntrinsicElements
  ? ElementRef<T>
  : T extends React.JSXElementConstructor<infer P>
    ? ElementRef<P>
    : never

export type ComponentProps<
  T extends keyof JSX.IntrinsicElements | React.JSXElementConstructor<unknown>,
> = T extends keyof JSX.IntrinsicElements
  ? ComponentPropsWithoutRef<T>
  : T extends React.JSXElementConstructor<infer P>
    ? P
    : never

// Utilidades de tipos genéricos
export type Prettify<T> = {
  [K in keyof T]: T[K]
} & {}

export type Nullable<T> = T | null

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}

export type DeepRequired<T> = {
  [P in keyof T]-?: T[P] extends object ? DeepRequired<T[P]> : T[P]
}

export type PickRequired<T, K extends keyof T> = Pick<T, K> & {
  [P in K]-?: T[P]
}

export type OmitStrict<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>

// Tipos de utilidad para arrays
export type ArrayElement<ArrayType extends readonly unknown[]> =
  ArrayType extends readonly (infer ElementType)[] ? ElementType : never

export type NonEmptyArray<T> = [T, ...T[]]

// Tipos de utilidad para funciones
export type AsyncReturnType<
  T extends (...args: unknown[]) => Promise<unknown>,
> = T extends (...args: unknown[]) => Promise<infer R> ? R : never

export type Parameters<T extends (...args: unknown[]) => unknown> = T extends (
  ...args: infer P
) => unknown
  ? P
  : never

// Tipos de utilidad para objetos
export type ValueOf<T> = T[keyof T]

export type KeysOfType<T, K> = {
  [P in keyof T]: T[P] extends K ? P : never
}[keyof T]

export type NonNullable<T> = T extends null | undefined ? never : T

// Exportar para uso en la aplicación
export {}
