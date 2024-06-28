"use client"
import React from 'react'
import { EquipmentSchema } from '@/lib/validations'


import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useFieldArray, useForm } from "react-hook-form"
import { z } from "zod"

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
import { Popover, PopoverTrigger, PopoverContent, } from '@radix-ui/react-popover'

import { Calendar } from '../ui/calendar'
import { cn } from '@/lib/utils'
import { Textarea } from '../ui/textarea'




const Equipment = () => {
    // 1. Define your form.
  const form = useForm<z.infer<typeof EquipmentSchema>>({
    resolver: zodResolver(EquipmentSchema),
    defaultValues: {
        title: "",
        brandname: "",
        model: "",
        serialNumber: "",
        assetTag: "",
        subunits: [],
        labNumber: "",
        labName: "",
        team: "",
        serviceDate: new Date(),
        tag: "",
        comment: "",
        imgUrl: "",
    },
  })


  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "subunits",
  });
 
  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof EquipmentSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values)
  }


      

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} 
      className="flex w-full flex-col gap-10">

        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem className='flex w-full flex-col'>
              <FormLabel className='paragraph-semibold text-dark400_light800'>Equipment Name <span className='text-primary-500'>*</span></FormLabel>
              <FormControl className='mt-3.5'>
                <Input 
                    className='no-focus paragraph-regular background-light900_dark300 light-border-2 text-dark300_light700 min-h-[56px] border'
                    placeholder='UV/VIS Spectrophotometer'
                    {...field} 
                />
              </FormControl>
              <FormDescription className='body-regular mt-2.5 text-light-500'>
                Give the specific name of the equipment.
              </FormDescription>
              <FormMessage  className='text-red-500'/>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="brandname"
          render={({ field }) => (
            <FormItem className='flex w-full flex-col gap-3'>
              <FormLabel className='paragraph-semibold text-dark400_light800'>Brand Name</FormLabel>
              <FormControl className='mt-3.5'>
              <Input 
                    className='no-focus paragraph-regular background-light900_dark300 light-border-2 text-dark300_light700 min-h-[56px] border'
                    placeholder='ThermoScientific'
                    {...field} 
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="model"
          render={({ field }) => (
            <FormItem className='flex w-full flex-col gap-3'>
              <FormLabel className='paragraph-semibold text-dark400_light800'>Model</FormLabel>
              <FormControl className='mt-3.5'>
              <Input 
                    className='no-focus paragraph-regular background-light900_dark300 light-border-2 text-dark300_light700 min-h-[56px] border'
                    placeholder='Evolution 60S'
                    {...field} 
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="serialNumber"
          render={({ field }) => (
            <FormItem className='flex w-full flex-col gap-3'>
              <FormLabel className='paragraph-semibold text-dark400_light800'>Serial Number</FormLabel>
              <FormControl className='mt-3.5'>
              <Input 
                    className='no-focus paragraph-regular background-light900_dark300 light-border-2 text-dark300_light700 min-h-[56px] border'
                    placeholder='123456789'
                    {...field} 
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="assetTag"
          render={({ field }) => (
            <FormItem className='flex w-full flex-col gap-3'>
              <FormLabel className='paragraph-semibold text-dark400_light800'>DMU Asset Tag </FormLabel>
              <FormControl className='mt-3.5'>
              <Input 
                    className='no-focus paragraph-regular background-light900_dark300 light-border-2 text-dark300_light700 min-h-[56px] border'
                    placeholder='056789'
                    {...field} 
                />
              </FormControl>
            </FormItem>
          )}
        />

<FormField
          control={form.control}
          name="serviceDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel className='paragraph-semibold text-dark400_light800'>Service Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[240px] pl-3 text-left font-normal no-focus background-light900_dark300 light-border-2 text-dark300_light700 min-h-[56px] border",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
                    mode="single"
                    selected={field.value}
                    onSelect={(date) => field.onChange(date?.toISOString())}
                    disabled={(date) =>
                      date > new Date() || date < new Date("1900-01-01")
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
          
            </FormItem>
          )}
        />

{/* <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Subunit</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        /> */}

        {fields.map((item, index) => (
          <div key={item.id} className="flex gap-4 flex-wrap">
            <FormField
              control={form.control}
              name={`subunits.${index}.title`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='paragraph-semibold text-dark400_light800'>Subunit Name</FormLabel>
                  <FormControl>
                    <Input 
                      className='no-focus background-light900_dark300 light-border-2 text-dark300_light700  border'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={`subunits.${index}.brandname`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='paragraph-semibold text-dark400_light800'>Brand Name</FormLabel>
                  <FormControl>
                    <Input 
                    className='no-focus background-light900_dark300 light-border-2 text-dark300_light700  border'
                    {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={`subunits.${index}.model`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='paragraph-semibold text-dark400_light800'>Model</FormLabel>
                  <FormControl>
                    <Input 
                    className='no-focus background-light900_dark300 light-border-2 text-dark300_light700  border'
                    {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={`subunits.${index}.serialNumber`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='paragraph-semibold text-dark400_light800'>Serial Number</FormLabel>
                  <FormControl>
                    <Input 
                    className='no-focus background-light900_dark300 light-border-2 text-dark300_light700  border'
                    {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={`subunits.${index}.assetTag`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='paragraph-semibold text-dark400_light800'>DMU Asset Tag</FormLabel>
                  <FormControl>
                    <Input 
                    className='no-focus background-light900_dark300 light-border-2 text-dark300_light700  border'
                    {...field}
                     />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={`subunits.${index}.serviceDate`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='paragraph-semibold text-dark400_light800'>Service Date </FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-[240px] pl-3 text-left font-normal no-focus background-light900_dark300 light-border-2 text-dark300_light700 min-h-[56px] border",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(new Date(field.value), "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
                        mode="single"
                        selected={field.value ? new Date(field.value) : undefined}
                        onSelect={(date) => field.onChange(date?.toISOString())}
                        disabled={(date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className="primary-gradient min-h-[46px] px-4 py-3 !text-light-900" type="button" onClick={() => remove(index)}>Remove</Button>
          </div>
        ))}

        <Button 
          className="primary-gradient  w-1/3 px-4 py-3 !text-light-900" 
          type="button" 
          onClick={() => append({ title: "", brandname: "", model: "", serialNumber: "", assetTag: "", serviceDate: new Date() })}>
          Add Subunit
        </Button>
        

<FormField
          control={form.control}
          name="labNumber"
          render={({ field }) => (
            <FormItem className='flex w-full flex-col gap-3'>
              <FormLabel className='paragraph-semibold text-dark400_light800'>Room/Lab Number <span className='text-primary-500'>*</span></FormLabel>
              <FormControl className='mt-3.5'>
              <Input 
                    className='no-focus paragraph-regular background-light900_dark300 light-border-2 text-dark300_light700 min-h-[56px] border'
                    {...field} 
                />
              </FormControl>
              <FormDescription className='body-regular mt-2.5 text-light-500'>
              LabNumber
              </FormDescription>
              <FormMessage  className='text-red-500'/>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="labName"
          render={({ field }) => (
            <FormItem className='flex w-full flex-col gap-3'>
              <FormLabel className='paragraph-semibold text-dark400_light800'>Room/Lab Name <span className='text-primary-500'>*</span></FormLabel>
              <FormControl className='mt-3.5'>
              <Input 
                    className='no-focus paragraph-regular background-light900_dark300 light-border-2 text-dark300_light700 min-h-[56px] border'
                    {...field} 
                />
              </FormControl>
              <FormDescription className='body-regular mt-2.5 text-light-500'>
              LabName
              </FormDescription>
              <FormMessage  className='text-red-500'/>
            </FormItem>
          )}
        />
<FormField
          control={form.control}
          name="team"
          render={({ field }) => (
            <FormItem className='flex w-full flex-col gap-3'>
              <FormLabel className='paragraph-semibold text-dark400_light800'>Team <span className='text-primary-500'>*</span></FormLabel>
              <FormControl className='mt-3.5'>
              <Input 
                    className='no-focus paragraph-regular background-light900_dark300 light-border-2 text-dark300_light700 min-h-[56px] border'
                    {...field} 
                />
              </FormControl>
              <FormDescription className='body-regular mt-2.5 text-light-500'>
              Technical, Teaching, Research teams
              </FormDescription>
              <FormMessage  className='text-red-500'/>
            </FormItem>
          )}
        /> 
  
  


        
    <FormField
          control={form.control}
          name="tag"
          render={({ field }) => (
            <FormItem className='flex w-full flex-col'>
              <FormLabel className='paragraph-semibold text-dark400_light800'>Equipment Type <span className='text-primary-500'>*</span></FormLabel>
              <FormControl className='mt-3.5'>
                <Input 
                    className='no-focus paragraph-regular background-light900_dark300 light-border-2 text-dark300_light700 min-h-[56px] border'
                    {...field} 
                    placeholder='Add General Equipment type/ category...'
                />
              </FormControl>
              <FormDescription className='body-regular mt-2.5 text-light-500'>
                Equipment type to determine their total
              </FormDescription>
              <FormMessage  className='text-red-500'/>
            </FormItem>
          )}
        />

        
<FormField
          control={form.control}
          name="comment"
          render={({ field }) => (
            <FormItem className='flex w-full flex-col'>
              <FormLabel className='paragraph-semibold text-dark400_light800'>Comment <span className='text-primary-500'>*</span></FormLabel>
              <FormControl className='mt-3.5'>
                <Textarea 
                    className='no-focus paragraph-regular background-light900_dark300 light-border-2 text-dark300_light700 min-h-[56px] border'
                    {...field} 
                    placeholder='Add General Equipment type...'
                />
              </FormControl>
              <FormDescription className='body-regular mt-2.5 text-light-500'>
               General comments, e.g damages, ownership, new ...
              </FormDescription>
              <FormMessage  className='text-red-500'/>
            </FormItem>
          )}
        />




        <Button className="primary-gradient min-h-[46px] px-4 py-3 !text-light-900" type="submit">Submit</Button>
      </form>
    </Form>
  )
}

export default Equipment;