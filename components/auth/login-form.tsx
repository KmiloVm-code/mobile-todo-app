'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Eye, EyeOff, Mail, Lock, Sparkles, AlertCircle } from 'lucide-react'
import { useActionState } from 'react'
import { authenticate } from '@/lib/queries/actions'
import { useSearchParams } from 'next/navigation'

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false)

  const searchParams = useSearchParams()
  const callbackUrl =
    searchParams.get('callbackUrl') || '/dashboard?filter=all&page=1'

  const [errorMessage, formAction, isPending] = useActionState(
    authenticate,
    undefined
  )

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Logo/Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl mb-4 shadow-lg">
          <Sparkles className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
          TaskFlow
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2">
          Tu gestor de tareas inteligente
        </p>
      </div>

      <Card className="border-0 shadow-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg rounded-3xl">
        <CardHeader className="text-center pb-2">
          <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100">
            ¡Bienvenido! 👋
          </h2>
          <p className="text-slate-500 dark:text-slate-400">
            Inicia sesión para continuar
          </p>
        </CardHeader>

        <CardContent className="p-8">
          <form action={formAction} className="space-y-6">
            <div className="space-y-3">
              <Label
                htmlFor="email"
                className="text-slate-700 dark:text-slate-300 font-semibold"
              >
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 dark:text-slate-500 w-5 h-5" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="tu@email.com"
                  className="pl-12 h-14 border-2 border-purple-100 dark:border-purple-800 focus:border-purple-400 dark:focus:border-purple-500 rounded-xl text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 bg-white dark:bg-slate-800"
                  required
                  disabled={isPending}
                />
              </div>
            </div>

            <div className="space-y-3">
              <Label
                htmlFor="password"
                className="text-slate-700 dark:text-slate-300 font-semibold"
              >
                Contraseña
              </Label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 dark:text-slate-500 w-5 h-5" />
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Tu contraseña"
                  className="pl-12 pr-12 h-14 border-2 border-purple-100 dark:border-purple-800 focus:border-purple-400 dark:focus:border-purple-500 rounded-xl text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 bg-white dark:bg-slate-800"
                  required
                  disabled={isPending}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300"
                  disabled={isPending}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <input type="hidden" name="redirectTo" value={callbackUrl} />

            <Button
              type="submit"
              disabled={isPending}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 dark:from-purple-600 dark:to-pink-600 dark:hover:from-purple-700 dark:hover:to-pink-700 text-white font-semibold h-14 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-disabled={isPending}
            >
              {isPending ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Iniciando sesión...
                </div>
              ) : (
                '✨ Iniciar Sesión'
              )}
            </Button>

            <div
              className="flex h-8 items-end space-x-1"
              aria-live="polite"
              aria-atomic="true"
            >
              {errorMessage && (
                <>
                  <AlertCircle className="h-5 w-5 text-red-500" />
                  <p className="text-sm text-red-500">{errorMessage}</p>
                </>
              )}
            </div>
          </form>

          <div className="mt-8 text-center">
            <p className="text-slate-500 dark:text-slate-400">
              ¿No tienes cuenta?{' '}
              <Link
                href="/register"
                className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-semibold hover:underline transition-colors"
              >
                Regístrate aquí
              </Link>
            </p>
          </div>

          {/* <div className="mt-6 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-2xl border border-emerald-200 dark:border-emerald-800">
            <p className="text-emerald-700 dark:text-emerald-300 text-sm font-medium">
              💡 Credenciales de prueba:
            </p>
            <p className="text-emerald-600 dark:text-emerald-400 text-sm mt-1">
              <strong>Email:</strong> demo@ejemplo.com
              <br />
              <strong>Contraseña:</strong> demo123
            </p>
          </div> */}
        </CardContent>
      </Card>
    </div>
  )
}
