/**
 * Tipos relacionados con componentes de UI
 */

import type { ReactNode } from 'react'

/** Variantes de tamaño comunes */
export type Size = 'sm' | 'md' | 'lg' | 'xl'

/** Variantes de color/tema */
export type Variant =
  | 'default'
  | 'primary'
  | 'secondary'
  | 'destructive'
  | 'outline'
  | 'ghost'
  | 'link'

/** Props base para componentes */
export interface BaseComponentProps {
  className?: string
  children?: ReactNode
}

/** Props para botones */
export interface ButtonProps extends BaseComponentProps {
  variant?: Variant
  size?: Size
  disabled?: boolean
  loading?: boolean
  type?: 'button' | 'submit' | 'reset'
  onClick?: () => void
}

/** Props para inputs */
export interface InputProps extends BaseComponentProps {
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url'
  placeholder?: string
  value?: string
  defaultValue?: string
  disabled?: boolean
  required?: boolean
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void
}

/** Props para textarea */
export interface TextareaProps extends BaseComponentProps {
  placeholder?: string
  value?: string
  defaultValue?: string
  disabled?: boolean
  required?: boolean
  rows?: number
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
}

/** Props para cards */
export interface CardProps extends BaseComponentProps {
  variant?: 'default' | 'outlined' | 'elevated'
  padding?: Size
  onClick?: () => void
}

/** Props para badges */
export interface BadgeProps extends BaseComponentProps {
  variant?: Variant
  size?: Size
}

/** Tipos de notificaciones/toast */
export type ToastType = 'default' | 'success' | 'error' | 'warning' | 'info'

/** Props para toast */
export interface ToastProps extends BaseComponentProps {
  type?: ToastType
  title?: string
  description?: string
  action?: ReactNode
  duration?: number
  onClose?: () => void
}

/** Props para modal/dialog */
export interface ModalProps extends BaseComponentProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title?: string
  description?: string
  size?: Size
  closable?: boolean
}

/** Props para dropdown */
export interface DropdownProps extends BaseComponentProps {
  trigger: ReactNode
  items: DropdownItem[]
  onSelect?: (value: string) => void
}

/** Item de dropdown */
export interface DropdownItem {
  value: string
  label: string
  icon?: ReactNode
  disabled?: boolean
  separator?: boolean
}

/** Props para tabs */
export interface TabsProps extends BaseComponentProps {
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  orientation?: 'horizontal' | 'vertical'
}

/** Item de tab */
export interface TabItem {
  value: string
  label: string
  content: ReactNode
  disabled?: boolean
}

/** Props para acordeón */
export interface AccordionProps extends BaseComponentProps {
  type?: 'single' | 'multiple'
  collapsible?: boolean
  value?: string | string[]
  onValueChange?: (value: string | string[]) => void
}

/** Item de acordeón */
export interface AccordionItem {
  value: string
  trigger: ReactNode
  content: ReactNode
  disabled?: boolean
}

/** Props para navegación */
export interface NavigationProps extends BaseComponentProps {
  items: NavigationItem[]
  orientation?: 'horizontal' | 'vertical'
  variant?: 'default' | 'pills' | 'underline'
}

/** Item de navegación */
export interface NavigationItem {
  id: string
  label: string
  href?: string
  icon?: ReactNode
  active?: boolean
  disabled?: boolean
  badge?: string | number
  children?: NavigationItem[]
}

/** Props para sidebar */
export interface SidebarProps extends BaseComponentProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  position?: 'left' | 'right'
  overlay?: boolean
  persistent?: boolean
}

/** Props para paginación */
export interface PaginationProps extends BaseComponentProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  showPrevNext?: boolean
  showFirstLast?: boolean
  maxVisiblePages?: number
}
