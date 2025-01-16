// import { SignUp } from "@clerk/nextjs";

// export default function Page() {
//   return <SignUp />;
// }

"use client"

import * as React from "react";
import { useSignUp } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

// Define the schema for the form using Zod
const formSchema = z.object({
  email: z
    .string()
    .email({ message: "Invalid email address" })
    .refine((email) => email.endsWith("dmu.ac.uk"), {
      message: "Only DMU email addresses are allowed.",
    }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long." }),
  firstName: z.string().min(1, { message: "First name is required." }),
  lastName: z.string().min(1, { message: "Last name is required." }),
  username: z.string().min(2, { message: "Username must be at least 2 characters long." }),
});

type FormData = z.infer<typeof formSchema>;

export default function CustomSignUp() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const [verifying, setVerifying] = React.useState(false);
  const [code, setCode] = React.useState("");
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const router = useRouter();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      username: "",
    },
  });

  const handleSignUp = async (data: FormData) => {
    const { email, password, firstName, lastName, username } = data;

    if (!isLoaded || !signUp) {
      setErrorMessage("Sign-up functionality is not available at the moment.");
      return;
    }

    try {
      await signUp.create({
        firstName,
        lastName,
        username,
        emailAddress: email,
        password,
      });

      await signUp.prepareEmailAddressVerification({
        strategy: "email_code",
      });

      setVerifying(true);
    } catch (err: any) {
      console.error("Error during sign up:", JSON.stringify(err, null, 2));
      setErrorMessage("There was an error during sign up.");
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isLoaded || !signUp || !setActive) {
      setErrorMessage("Verification functionality is not available at the moment.");
      return;
    }

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({ code });

      if (completeSignUp.status === "complete") {
        await setActive({ session: completeSignUp.createdSessionId });
        router.push("/");
      } else {
        console.error(JSON.stringify(completeSignUp, null, 2));
      }
    } catch (err: any) {
      console.error("Error during verification:", JSON.stringify(err, null, 2));
      setErrorMessage("There was an error during verification.");
    }
  };

  if (verifying) {
    return (
      <div className="flex flex-col min-h-screen p-0 sm:p-12">
        <div className="mx-auto max-w-md px-6 py-12 bg-white border-0 shadow-lg sm:rounded-3xl">
        <h1 className="h1-bold gap-5 mt-3 py-3">Verify your email</h1>
        <form onSubmit={handleVerify}>
          <label className='paragraph-semibold' id="code">Enter your verification code</label>
          <input className='no-focus paragraph-regular background-light-900 light-border-1 min-h-[56px] border rounded px-10 mr-5' value={code} id="code" name="code" onChange={(e: any) => setCode(e.target.value)} />
          <button className="primary-gradient rounded w-fit min-h-[46px] px-4 py-3 text-white" type="submit">Verify</button>
        </form>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen p-0 sm:p-12">
      <div className="mx-auto max-w-md px-6 py-12 bg-white border-0 shadow-lg sm:rounded-3xl">
      <h1 className="h1-bold gap-5 mt-3 mb-5">Sign up</h1>
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSignUp)} className="flex w-full flex-col gap-10">

        <FormField
          control={form.control}
          name="firstName"
          render={({ field }) => (
            <FormItem className='flex w-full flex-col'>
              <FormLabel className='paragraph-semibold'>First Name <span className='text-primary-500'>*</span></FormLabel>
              <FormControl className='mt-1.5'>
                <Input 
                className='no-focus paragraph-regular background-light-900 light-border-1 min-h-[56px] border'
                placeholder="John" {...field} />
              </FormControl>
              <FormMessage className='text-red-500' />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="lastName"
          render={({ field }) => (
            <FormItem className='flex w-full flex-col'>
              <FormLabel className='paragraph-semibold '>Last Name <span className='text-primary-500'>*</span></FormLabel>
              <FormControl className='mt-1.5'>
                <Input 
                className='no-focus paragraph-regular background-light-900 light-border-1 min-h-[56px] border'
                placeholder="Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem className='flex w-full flex-col'>
              <FormLabel className='paragraph-semibold'>Username <span className='text-primary-500'>*</span></FormLabel>
              <FormControl className='mt-1.5'>
                <Input 
                className='no-focus paragraph-regular background-light-900 light-border-1 min-h-[56px] border'
                placeholder="johndoe" {...field} />
              </FormControl>
              <FormDescription className='body-regular mt-2.5 text-light-500'>
                This is your public display name.
              </FormDescription>
              <FormMessage className='text-red-500' />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className='flex w-full flex-col'>
              <FormLabel className='paragraph-semibold'>Email <span className='text-primary-500'>*</span></FormLabel>
              <FormControl className='mt-1.5'>
                <Input 
                className='no-focus paragraph-regular background-light-900 light-border-1 min-h-[56px] border'
                type="email"
                placeholder="...dmu.ac.uk" {...field} />
              </FormControl>
              <FormDescription className='body-regular mt-2.5 text-light-500'>
                Please use your DMU email address.
              </FormDescription>
              <FormMessage className='text-red-500'/>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem className='flex w-full flex-col'>
              <FormLabel className='paragraph-semibold'>Password <span className='text-primary-500'>*</span></FormLabel>
              <FormControl className='mt-1.5'>
                <Input 
                className='no-focus paragraph-regular background-light-900 light-border-1 min-h-[56px'
                type="password" placeholder="********" {...field} />
              </FormControl>
              <FormDescription className='body-regular mt-2.5 text-light-500'>
                Password must be at least 8 characters long.
              </FormDescription>
              <FormMessage className='text-red-500' />
            </FormItem>
          )}
        />
        {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
        <Button className="primary-gradient w-full min-h-[46px] px-4 py-3 text-white" type="submit">Next</Button>
      </form>
    </Form>
    </div>
    </div>
  );
}
