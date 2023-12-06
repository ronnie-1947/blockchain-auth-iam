'use client'

import { ContextProvider, useContext } from '@/hooks/useAuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

const Auth = ({ children }) => {
  const { dispatch } = useContext()
  const router = useRouter()
  
  useEffect(()=>{
    const user = window.localStorage.getItem('token')
    if (!user) {
      router.push('/login')
    }
    dispatch({ type: 'login', payload: user })
  }, [])

  return (
    <>{children}</>
  )
}

export default function Template({ children }) {

  return <ContextProvider><Auth><>{children}</></Auth></ContextProvider>
}