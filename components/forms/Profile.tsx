"use client";

import React, { useState } from 'react'
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from '../ui/textarea';
import { ProfileSchema } from '@/lib/validations';
import { usePathname, useRouter } from 'next/navigation';
import { updateUser } from '@/lib/actions/user.action';
import { toast } from '../ui/use-toast';

interface Props {
    clerkId: string;
    user: string;
}


const Profile = ({clerkId, user}: Props) => {
    const parsedUser = JSON.parse(user);
    const [isSubmitting, setIsSubmitting] = useState(false)
    const router = useRouter();
    const pathname = usePathname();

    const formSchema = z.object({
        username: z.string().min(2, {
          message: "Username must be at least 2 characters.",
        }),
      })

   // 1. Define your form.
  const form = useForm<z.infer<typeof ProfileSchema>>({
    resolver: zodResolver(ProfileSchema),
    defaultValues: {
        name: parsedUser.name || "",
        username: parsedUser.username || "",
        email: parsedUser.email || "",
        bio: parsedUser.bio || ""
    },
  })

   // 2. Define a submit handler.
   async function onSubmit(values: z.infer<typeof ProfileSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log("Form values", values)
    setIsSubmitting(true)
    try {
        // updateuser
        await updateUser({
            clerkId,
            updateData: {
                name: values.username,
                username: values.username,
                email: values.email,
                bio: values.bio
            },
            path: pathname
        })

        router.back();
        
    } catch (error) {
        console.log("Failed to update user", error)
        toast({
            variant: "destructive",
            title: "Failed to update user",
            description: "Something went wrong while updating user",
        })
        throw error
    } finally {
        setIsSubmitting(false)
    }

  }


  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="mt-9 flex w-full flex-col gap-9">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="space-y-3.5">
              <FormLabel className="paragraph-semibold text-dark400_light800">
                Your Name <span className="text-primary-500">*</span>
              </FormLabel>
              <FormControl>
                <Input 
                    placeholder="Full Name"
                    className="no-focus paragraph-regular light-border-2 background-light800_dark300 text-dark300_light700 min-h-[56px] border" 
                    {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem className="space-y-3.5">
              <FormLabel className="paragraph-semibold text-dark400_light800">
                Username <span className="text-primary-500">*</span>
                </FormLabel>
              <FormControl>
                <Input 
                    placeholder="FName"
                    className="no-focus paragraph-regular light-border-2 background-light800_dark300 text-dark300_light700 min-h-[56px] border" 
                    {...field} />
              </FormControl>
            </FormItem>
          )}
        />

<FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="space-y-3.5">
              <FormLabel className="paragraph-semibold text-dark400_light800">
                Email <span className="text-primary-500">*</span>
                </FormLabel>
              <FormControl>
                <Input 
                    placeholder="p1234567@my365.dmu.ac.uk"
                    className="no-focus paragraph-regular light-border-2 background-light800_dark300 text-dark300_light700 min-h-[56px] border" 
                    {...field} />
              </FormControl>
            </FormItem>
          )}
        />

<FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem className="space-y-3.5">
              <FormLabel className="paragraph-semibold text-dark400_light800">Bio</FormLabel>
              <FormControl>
                <Textarea 
                    placeholder="PhD Student, Senior BMsc Lecturer, Lab Technician etc."
                    className="no-focus paragraph-regular light-border-2 background-light800_dark300 text-dark300_light700 min-h-[56px] border" 
                    {...field} />
              </FormControl>
              <FormDescription>
                A short description about your work/role.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="mt-7 flex justify-end">
          <Button type="submit" className="primary-gradient w-fit text-dark400_light800" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save"}
          </Button>
        </div>

      </form>
    </Form>
  )
}

export default Profile