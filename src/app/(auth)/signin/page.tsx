"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
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
import { signInSchema } from "@/schemas/signInSchema";
import { signIn } from "next-auth/react";
const Signin = () => {
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifire: "",
      password: "",
    },
  });

  // Handling user Signup

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    const result = await signIn("credentials", {
      redirect: false,
      identifire: data.identifire,
      password: data.password,
    });

    if (result?.error) {
      if (result?.error === "credentialsSignin") {
        toast({
          title: "Loggin faild",
          description: "Incorrect username or email",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Loggin Faild",
          description: result.error,
          variant: "default",
        });
      }
    }
    router.replace("/dashboard")
  };

  return (
    <div className="flex justify-center min-h-screen bg-gray-800">
      <div className="w-full max-w-md max-h-min mt-20 p-8 rounded-lg shadow-md bg-white">
        <div className="text-center">
          <h1 className="text-5xl font-extrabold">Welcome to ShadowText</h1>
          <p className="mb-4 mt-6">Login to start your anonymous adventure</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="identifire"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold text-base">
                    Email
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="email or username" {...field} />
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
                  <FormLabel className="font-semibold text-base">
                    Password
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="password" type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" >
              LogIn
            </Button>
          </form>
        </Form>
        <div className="text-center mt-4">
          <p>Alredy member?</p>
          <Link href={"/signup"} className="text-blue-600 hover:text-blue-800">
            SignUp
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Signin;
