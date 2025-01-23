'use client'
import { SessionProvider } from "next-auth/react"

type reactNodeType ={
    children:React.ReactNode
}

export default function AuthProvider({children}:reactNodeType) {
  return (
    <SessionProvider>
     {children}
    </SessionProvider>
  )
}