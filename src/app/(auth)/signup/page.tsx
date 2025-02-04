/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useDebounceValue } from "usehooks-ts";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
// import {signInSchema} from "@/schemas/signInSchema"
import { signupValidation } from "@/schemas/signupSchema";
import { apiResponse } from "@/types/appResponse";
import axios, { AxiosError } from "axios";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
const Signin = () => {
  const [username, setUsername] = useState("");
  const [usernameMessage, setUsernameMessage] = useState("");
  const [usernameCheaking, setUsernameCheaking] = useState(false);
  const [isSubmiting, setIsSubmiting] = useState(false);
  const deBouncedUsername = useDebounceValue(username, 300);
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof signupValidation>>({
    resolver: zodResolver(signupValidation),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  // Handling realtime username cheaking
  useEffect(() => {
    const checkUsername = async () => {
      if (deBouncedUsername) {
        setUsernameCheaking(true);
        setUsernameMessage("");
      }
      try {
        const response = await axios.get(
          `/api/check-username-unqie?username=${deBouncedUsername}`
        );

        setUsernameMessage(response.data.message);
      } catch (error) {
        const axiosErorr = error as AxiosError<apiResponse>;
        setUsernameMessage(
          axiosErorr.response?.data.message ?? "Error Cheaking username"
        );
      } finally {
        setUsernameCheaking(false);
      }
    };
    checkUsername();
  }, [deBouncedUsername]);

  // Handling user Signup

  const onSubmit = async (data: z.infer<typeof signupValidation>) => {
    setIsSubmiting(true);
    try {
      const response = await axios.post(`/api/signup`, data);
      toast({
        title: "Success",
        description: response.data.message,
      });
      router.replace(`verify/${username}`);
      setIsSubmiting(false);
    } catch (error) {
      console.error("Faild to signup: ", error);
      const axiosError = error as AxiosError<apiResponse>;
      //Default Error Message
      const errorMessage =
        axiosError.response?.data.message ||
        "Error occured during signup! Please try again";
      toast({
        title: "Signup faild",
        description: errorMessage,
        variant: "destructive",
      });
      setIsSubmiting(false);
    }
  };

  return (
    <div className="flex justify-center min-h-screen bg-gray-800">
      <div className="w-full max-w-md p-8 rounded-lg shadow-md bg-white">
        <div className="text-center">
          <h1 className="text-4xl">Jopin the era of Anynomus</h1>
          <p className="mb-4">Sign up to start your anonymous adventur</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-x-6">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="username"
                      {...field}
                      onChange={(e) =>{
                        field.onChange(e)
                        setUsername(e.target.value)
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="password"
                      type="password"
                      {...field}
                      onChange={(e) =>{
                        field.onChange(e)
                        setUsername(e.target.value)
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isSubmiting}>
              {isSubmiting ? (
                <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin"/> Please wait
                </>
              ) : "SignUp"}
            </Button>
          </form>
        </Form>
        <div className="text-center mt-4">
            <p>Alredy member?</p>
            <Link href={"/signin"} className="text-blue-600 hover:text-blue-800">SignIn</Link>
        </div>
      </div>
    </div>
  );
};

export default Signin;
