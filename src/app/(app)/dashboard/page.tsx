"use client"
/* eslint-disable @typescript-eslint/no-unused-vars */
import {useCallback, useState} from "react"
import { Message } from "@/models/userModel"
import { useToast } from "@/hooks/use-toast"
import { useSession } from "next-auth/react"
import { useForm } from "react-hook-form"
import { messageAcceptValidation } from "@/schemas/acceptMessageSchema"
import { fromJSON } from "postcss"
import { zodResolver } from "@hookform/resolvers/zod"
const Dashboard = () => {
    const [messages, setMessages] = useState<Message []>([])
    const [isLoading, setIsLoading] = useState(false)
    const [isSwtiching, setIsSwtiching] = useState(false)

    const {toast} = useToast()

    const handleDeleteMessage = (messageId: string) => {
      setMessages(messages.filter((message)=> message._id !== messageId))
    }

    const {data:session} = useSession()

    const form = useForm({
      resolver: zodResolver(messageAcceptValidation)
    })

    const {register, watch, setValue} = form
    const acceptMessages = watch('acceptMessages')

    const fetchAcceptMessages = useCallback(()=>{
      setIsSwtiching(true)
    })

  return (
      <div>
        Dashboard
      </div>
    )
  }
  
  export default Dashboard