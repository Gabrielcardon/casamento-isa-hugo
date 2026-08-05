import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  type User,
} from 'firebase/auth'
import { useEffect, useState } from 'react'
import { auth, isFirebaseConfigured } from '../lib/firebase'

const DEMO_ADMIN_KEY = 'casamento-demo-admin'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [demoAdmin, setDemoAdmin] = useState(
    () => localStorage.getItem(DEMO_ADMIN_KEY) === '1',
  )
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isFirebaseConfigured || !auth) {
      setLoading(false)
      return
    }

    return onAuthStateChanged(auth, (u) => {
      setUser(u)
      setLoading(false)
    })
  }, [])

  const isAdmin = isFirebaseConfigured ? Boolean(user) : demoAdmin

  async function login(email: string, password: string) {
    if (!isFirebaseConfigured || !auth) {
      // Modo demo: qualquer e-mail + senha "admin" libera o painel
      if (password === 'admin') {
        localStorage.setItem(DEMO_ADMIN_KEY, '1')
        setDemoAdmin(true)
        return
      }
      throw new Error('No modo demo, use a senha: admin')
    }

    await signInWithEmailAndPassword(auth, email, password)
  }

  async function logout() {
    if (!isFirebaseConfigured || !auth) {
      localStorage.removeItem(DEMO_ADMIN_KEY)
      setDemoAdmin(false)
      return
    }
    await signOut(auth)
  }

  return {
    user,
    isAdmin,
    loading,
    login,
    logout,
    isDemoMode: !isFirebaseConfigured,
  }
}
