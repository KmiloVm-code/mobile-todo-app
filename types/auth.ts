/**
 * Tipos relacionados con autenticación y usuarios
 */

import type { BaseEntity, Language, DefaultView } from './common'

/** Preferencias de usuario */
export interface UserPreferences {
  theme: 'light' | 'dark'
  notifications: boolean
  language: Language
  defaultView: DefaultView
}

/** Usuario de la aplicación */
export interface User extends BaseEntity {
  name: string
  email: string
  password: string
  avatar?: string
  preferences: UserPreferences
}

/** Datos de registro de usuario */
export interface RegisterData {
  name: string
  email: string
  password: string
  confirmPassword?: string
}

/** Datos de inicio de sesión */
export interface LoginData {
  email: string
  password: string
}

/** Respuesta de autenticación */
export interface AuthResponse {
  success: boolean
  message: string
  user?: User
  token?: string
}

/** Estado de autenticación */
export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

/** Contexto de autenticación */
export interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<boolean>
  register: (
    name: string,
    email: string,
    password: string
  ) => Promise<AuthResponse>
  logout: () => void
  updatePreferences: (preferences: Partial<UserPreferences>) => void
  clearError: () => void
}

/** Datos de perfil de usuario */
export interface UserProfile extends Omit<User, 'preferences'> {
  bio?: string
  location?: string
  website?: string
}

/** Actualización de perfil */
export interface ProfileUpdateData {
  name?: string
  avatar?: string
  bio?: string
  location?: string
  website?: string
}

/** Token de autenticación */
export interface AuthToken {
  accessToken: string
  refreshToken?: string
  expiresIn: number
  tokenType: 'Bearer'
}

/** Sesión de usuario */
export interface UserSession {
  user: User
  token: AuthToken
  lastActivity: string
}
