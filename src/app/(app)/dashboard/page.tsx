"use client";
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useCallback, useEffect, useState } from "react";
import { Message } from "@/models/userModel";
import { useToast } from "@/hooks/use-toast";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { messageAcceptValidation } from "@/schemas/acceptMessageSchema";
import { fromJSON } from "postcss";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { apiResponse } from "@/types/appResponse";
import { access } from "fs";
import { User } from "next-auth";
import MessageCard from "@/components/messageCard";
import { Loader2, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
const Dashboard = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSwtiching, setIsSwtiching] = useState(false);

  const { toast } = useToast();
// handling UI without changing database
  const handleDeleteMessage = (messageId: string) => {
    setMessages(messages.filter((message) => message._id !== messageId));
  };

  const { data: session } = useSession();

  const form = useForm({
    resolver: zodResolver(messageAcceptValidation),
  });

  const { register, watch, setValue } = form;
  const acceptMessages = watch("acceptMessages");
  // getting acceptmessage status
  const fetchAcceptMessages = useCallback(async () => {
    setIsSwtiching(true);
    try {
      const response = await axios.get<apiResponse>(`/api/accept-message`);
      setValue("acceptMessages", response.data.isAcceptingMessage);
    } catch (error) {
      const axiosError = error as AxiosError<apiResponse>;
      toast({
        title: "Error",
        description: axiosError?.message,
        variant: "destructive",
      });
    } finally {
      setIsSwtiching(false);
    }
  }, [setValue, toast]);
// Getting all the messages
  const fetchMessages = useCallback(async (refresh:boolean = false) => {
    setIsLoading(true)
    setIsSwtiching(true)
    try {
      const response = await axios.get(`/api/get-messages`)
      setMessages(response.data || [])
      if (refresh) {
        toast({
          title:"Refreshed Messages",
          description:"Latest Messages",
          variant:"destructive"
        })
      }
    } catch (error) {
      const axiosError = error as AxiosError<apiResponse>;
      toast({
        title: "Error",
        description: axiosError?.message || "Faild to get Messages",
        variant: "destructive",
      });
    } finally {
      setIsSwtiching(false);
      setIsLoading(false)
    }
  }, [setIsSwtiching, setIsLoading, toast]);

  // Fetching initial state from database 
  useEffect(()=>{
    if(!session || !session.user) return
    fetchAcceptMessages()
    fetchMessages()
  }, [setIsSwtiching, setIsLoading, session, fetchAcceptMessages, fetchMessages, toast])

  const handleSwitchChnage = async ()=>{
    try {
      const response = await axios.post('/api/accept-message', {
        acceptMessages: !acceptMessages
      })
      setValue('acceptMessages', response.data)
      toast({
        title: response.data.message,
        variant: 'default',
      });
    } catch (error) {
      const axiosError = error as AxiosError<apiResponse>;
      toast({
        title: "Error",
        description: axiosError?.message ||"faild to update message setting",
        variant: "destructive",
      });
    }
  }
  // Clipboard of profile url
  const {username} = session?.user as User
  const baseUrl = `${window.location.protocol}//${window.location.host}`
  const profileUrl = `${baseUrl}/u/${username}`

  const handlingCopyClipboard = () =>{
    navigator.clipboard.writeText(profileUrl)
    toast({
      title:"Copied",
      description:"Profile url has been copied to clipboard",
      variant:"default"
    })
  }

  if (!session || !session.user) {
    return <></>
  }
  
  return (
    <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
      <h1 className="text-4xl font-bold mb-4">User Dashboard</h1>

      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Copy Your Unique Link</h2>{' '}
        <div className="flex items-center">
          <input
            type="text"
            value={profileUrl}
            disabled
            className="input input-bordered w-full p-2 mr-2"
          />
          <Button onClick={handlingCopyClipboard}>Copy</Button>
        </div>
      </div>

      <div className="mb-4">
        <switch
          {...register('acceptMessages')}
          checked={acceptMessages}
          onCheckedChange={handleSwitchChnage}
          disabled={isSwtiching}
        />
        <span className="ml-2">
          Accept Messages: {acceptMessages ? 'On' : 'Off'}
        </span>
      </div>
      <Separator />

      <Button
        className="mt-4"
        variant="outline"
        onClick={(e) => {
          e.preventDefault();
          fetchMessages(true);
        }}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <RefreshCcw className="h-4 w-4" />
        )}
      </Button>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        {messages.length > 0 ? (
          messages.map((message, index) => (
            <MessageCard
              key={message?._id}
              message={message}
              onMessageDelete={handleDeleteMessage}
            />
          ))
        ) : (
          <p>No messages to display.</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
