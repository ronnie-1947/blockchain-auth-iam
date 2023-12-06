'use client'

import useAuth from '@/hooks/useAuth'
import { ContextProvider, useContext } from '@/hooks/useAuthContext'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect } from 'react'

const Auth = ({ children }) => {
  useAuth()
  const { dispatch } = useContext()
  const router = useRouter()
  const pathname = usePathname()
  
  useEffect(() => {
    const userTkn = window.localStorage.getItem('token')
    if (!userTkn) {
      if(!pathname.includes('signup')) router.push('/login')
      return
    }
    const user = JSON.parse(userTkn)
    dispatch({ type: 'login', payload: user })
  }, [])


  return (
    <>{children}</>
  )
}

export default function Template({ children }) {
  return <ContextProvider><Auth>{children}</Auth></ContextProvider>
}