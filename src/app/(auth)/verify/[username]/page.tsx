"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { verifySchema } from "@/schemas/verifySchema";
import { apiResponse } from "@/types/appResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import z from "zod";
const VerifyAccount = () => {
  const router = useRouter();
  const params = useParams<{ username: string }>();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
  });

  const onSubmit = async (data: z.infer<typeof verifySchema>) => {
    try {
      const res = await axios.post<apiResponse>("/api/verify-code", {
        username: params.username,
        code: data.code,
      });

      toast({
        title: "success",
        description: res.data.message,
      });

      router.replace("/signin");
    } catch (error) {
      console.error(error);
      const axioxErrors = error as AxiosError<apiResponse>;
      toast({
        title: "success",
        description: axioxErrors.response?.data.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-800">
      <div className="w-full max-w-md p-8 rounded-lg shadow-md bg-slate-50">
        <div className="text-center">
          <h1 className="text-5xl font-extrabold">Verify your account</h1>
          <p className="mb-6 mt-2">Enter your verification code below</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold">Verifcation code</FormLabel>
                  <FormControl>
                    <Input className="focus-visible::outline-none border-1 border-black" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Submit</Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default VerifyAccount;
