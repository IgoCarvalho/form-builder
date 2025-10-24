"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { register } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import Link from "next/link";
import { toast } from "sonner";
import { RegisterFormData, RegisterSchema } from "@/schemas/auth";
import { LoaderIcon } from "lucide-react";

export default function RegisterPage() {
  const form = useForm<RegisterFormData>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      password: "",
      name: "",
      fullname: "",
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      const response = await register(data);

      if (!response.success) {
        toast.warning("Problem", { description: response.message });
      }
    } catch (error) {
      if (isRedirectError(error)) {
        return;
      }

      console.error({ error });
      toast.error("Error", {
        description: "Something went wrong, please try again later ",
      });
    }
  };

  return (
    <Card className="w-full md:w-[350px]">
      <CardHeader>
        <CardTitle className="text-xl">Create a new account</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Form {...form}>
          <form
            id="login-form"
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
          >
            <div className="space-y-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your username" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="space-y-2">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Enter your password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </form>
        </Form>
      </CardContent>
      <CardFooter>
        <Button
          form="login-form"
          type="submit"
          className="w-full"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting && (
            <LoaderIcon className=" animate-spin" />
          )}
          Create
        </Button>
      </CardFooter>

      {/* <FieldDescription className="text-center">
									Don&apos;t have an account?{" "}
									<a href="/signup" className="text-blue-400">
										Sign up
									</a>
								</FieldDescription> */}

      <p className=" text-center text-sm">
        Already have an account?{" "}
        <Link className="underline" href="/login">
          Sign in
        </Link>
      </p>
    </Card>
  );
}
