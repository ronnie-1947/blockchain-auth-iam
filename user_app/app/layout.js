'use client'

import { Inter } from 'next/font/google'
import './globals.css'
import useAuth from '@/hooks/useAuth'

const inter = Inter({ subsets: ['latin'] })


export default function RootLayout({ children }) {

  useAuth()
  
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
