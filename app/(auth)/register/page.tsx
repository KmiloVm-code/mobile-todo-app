import type { Metadata } from 'next'
import { RegisterForm } from '@/components/auth/register-form'

export const metadata: Metadata = {
  title: 'Registro - TaskFlow',
  description: 'Crea tu cuenta en TaskFlow y comienza a organizar tus tareas',
}

export default function RegisterPage() {
  return <RegisterForm />
}
