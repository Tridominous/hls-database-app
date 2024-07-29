"use client"
import React, { useCallback, useEffect, useState } from 'react'
import { EquipmentSchema } from '@/lib/validations'
import axios from 'axios'


import { format } from "date-fns"
import { CalendarIcon, Loader2, XCircle } from "lucide-react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useFieldArray, useForm } from "react-hook-form"
import { z } from "zod"
import { useRouter, usePathname } from 'next/navigation'

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
import { useToast } from "@/components/ui/use-toast"

import { UploadButton } from '@/utils/uploadthing'
import Image from 'next/image'
import { createEquipment, editEquipment } from '@/lib/actions/equipment.action'



interface Props {
  type?: string;
  mongoUserId: string;
  equipmentDetails?: string;

}

const Equipment = ({type, mongoUserId, equipmentDetails}: Props) => {
  console.log("Starting Equipment component render");
const [imagedata, setImagedata] = useState<string | undefined>("")
const [imageIsdeleting, setImageIsdeleting] = useState(false);
const [parsedDetails, setParsedDetails] = useState<any>({});
const {toast} = useToast()
const [isSubmitting, setIsSubmitting] = useState(false)
const router = useRouter();
const pathname = usePathname();

const form = useForm<z.infer<typeof EquipmentSchema>>({
  resolver: zodResolver(EquipmentSchema),
  defaultValues: {
    title: "",
    brandname: "",
    modelname: "",
    serialNumber: "",
    assetTag: "",
    subunits: [],
    labNumber: "",
    labName: "",
    team: "",
    serviceDate: new Date('2024-06-13'),
    tag: "",
    comment: "",
    imgUrl: "",
  },
});

useEffect(() => {
  console.log("Component mounted");
  if (equipmentDetails) {
    try {
      const parsed = typeof equipmentDetails === 'string' ? JSON.parse(equipmentDetails) : equipmentDetails;
      console.log("Parsed Equipment details", parsed);
      setParsedDetails(parsed);
    } catch (error) {
      console.error("Error parsing equipmentDetails:", error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to parse equipment details'
      });
    }
  }
}, [equipmentDetails, toast]);

useEffect(() => {
  if (Object.keys(parsedDetails).length > 0) {
    console.log("Updating form with parsed details");
    form.reset({
      title: parsedDetails.title || "",
      brandname: parsedDetails.brandname || "",
      modelname: parsedDetails.modelname || "",
      serialNumber: parsedDetails.serialNumber || "",
      assetTag: parsedDetails.assetTag || "",
      subunits: parsedDetails.subunits || [],
      labNumber: parsedDetails.labNumber || "",
      labName: parsedDetails.labName || "",
      team: parsedDetails.team || "",
      serviceDate: parsedDetails.serviceDate ? new Date(parsedDetails.serviceDate.$date || parsedDetails.serviceDate) : new Date('2024-06-13'),
      tag: parsedDetails?.tag?.name || "",
      comment: parsedDetails.comment || "",
      imgUrl: parsedDetails.imgUrl || "",
    });
  }
}, [parsedDetails, form]);
  console.log("Form initialized");
  console.log("2 Atfer parsed equipment")
  //Array of subunits
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "subunits",
  });
 
  console.log("Field array initialized");
  console.log("3 Atfer parsed equipment")


console.log("States and hooks initialized");


const handleImageUpload = useCallback((uploadedUrl: string) => {
  setImagedata(uploadedUrl);
  form.setValue('imgUrl', uploadedUrl, {
    shouldValidate: true,
    shouldDirty: true,
    shouldTouch: true
  });
}, [form]);


const handleImageDelete = (image: string) => {
  setImageIsdeleting(true)
  const imageKey = image.substring(image.lastIndexOf('/') + 1)
  axios.post('api/uploadthing/delete', {imageKey}).then(() => {
    setImagedata('');
    toast({
      variant: 'success',
      description: "🗑️ Image Removed Successfully"
    })
  }).catch(() => {
    toast({
      variant: 'destructive',
      description: "image not removed, something went wrong 😢"
  })
}).finally(() => setImageIsdeleting(false))

}
     


  // . Define a submit handler.z
  async function onSubmit(values: z.infer<typeof EquipmentSchema>) {
    console.log("Form submitted", values);
    setIsSubmitting(true);
  
    try {
      // Check if mongoUserId exists and is a valid JSON string
      const authorId = mongoUserId;
      console.log("Checking authorId", authorId);
  
      if (!authorId) {
        toast({
          variant: 'destructive',
          title: 'Error creating equipment',
          description: 'User not authenticated.'
        });
        throw new Error("User not authenticated");
      }
  
      if (type === 'Edit') {
         // Delete old image if it exists
         if (parsedDetails.imgUrl && parsedDetails.imgUrl !== values.imgUrl) {
          await handleImageDelete(parsedDetails.imgUrl);
          console.log("Deleted imgUrl from Uploadthing")
        } else {
          console.log("No imgUrl to delete | failed to delete imgUrl from Uploadthing")
        }



        const editParams = {
          equipmentId: parsedDetails._id,
          ...values,
          path: pathname
        };
      
        console.log('Edit params:', editParams);
      
        try {
          console.log('Trying to edit equipment');
          const updatedEquipment = await editEquipment(editParams);
          console.log("Updated equipment:", updatedEquipment);
      
          if (updatedEquipment) {
            console.log("Update successful, showing toast");
            toast({
              variant: 'success',
              title: 'Equipment updated successfully',
              description: 'Your equipment has been updated in the database.'
            });
      
            console.log("Redirecting to equipment page");
            router.push(`/equipment/${updatedEquipment._id}`);
            
            // Reset form
            console.log('About to reset form');
            form.reset();
            setImagedata(undefined);

      
          } else {
            console.log("Update failed: No updated equipment returned");
            throw new Error('Failed to update equipment: No data returned');
          }
        } catch (error: any) {
          console.error("Error editing equipment", error);
          if (error instanceof Error) {
            console.error("Edit func Error message:", error.message);
            console.error("Edit func Error stack:", error.stack);
          }
          toast({
            variant: 'destructive',
            title: 'Error editing equipment',
            description: `Something went wrong: ${error.message}`
          });
        }
      } else {
        try {
          const response = await createEquipment({
            title: values.title,
            brandname: values.brandname || "",
            modelname: values.modelname || "",
            serialNumber: values.serialNumber || "",
            assetTag: values.assetTag || "",
            subunits: values.subunits || [],
            labNumber: values.labNumber || "",
            labName: values.labName || "",
            team: values.team || "",
            tag: values.tag || "",
            serviceDate: values.serviceDate ? new Date(values.serviceDate) : new Date(),
            comment: values.comment || "",
            imgUrl: values.imgUrl || "",
            author: JSON.parse(authorId),
            path: pathname
          });
          console.log("createEquipment response: ", response);
  
          console.log("About to show success toast");
          toast({
            variant: 'success',
            title: 'Equipment added successfully',
            description: 'Your equipment has been added to the database.'
          });
  
          // Reset form
          console.log('About to reset form');
          form.reset();
          setImagedata(undefined);
  
          // Redirect to home page
          console.log('About to redirect to home page');
          router.push('/');
        } catch (error: any) {
          console.error("Error creating equipment", error);
          if (error instanceof Error) {
            console.error("Error message:", error.message);
            console.error("Error stack:", error.stack);
          }
          toast({
            variant: 'destructive',
            title: 'Error creating equipment',
            description: `Something went wrong while creating the equipment. Please try again. ${error.message}`
          });
        }
      }
    } catch (error: any) {
      console.error("Failed to process the form:", error);
      if (error instanceof Error) {
        console.error("Error message:", error.message);
        console.error("Error stack:", error.stack);
      }
      toast({
        variant: 'destructive',
        title: 'Error',
        description: `Unexpected error: ${error.message}`
      });
    } finally {
      console.log('Setting isSubmitting to false');
      setIsSubmitting(false);
    }
  }
  
  console.log("Render completed");

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
              <FormMessage  className='text-red-500'/>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="modelname"
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
              <FormMessage  className='text-red-500'/>
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
              <FormMessage  className='text-red-500'/>
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
              <FormMessage  className='text-red-500'/>
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
                  <FormMessage  className='text-red-500'/>
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
                  <FormMessage  className='text-red-500'/>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={`subunits.${index}.modelname`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='paragraph-semibold text-dark400_light800'>Model</FormLabel>
                  <FormControl>
                    <Input 
                    className='no-focus background-light900_dark300 light-border-2 text-dark300_light700  border'
                    {...field}
                    />
                  </FormControl>
                  <FormMessage  className='text-red-500'/>
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
                  <FormMessage  className='text-red-500'/>
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
                  <FormMessage  className='text-red-500'/>
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
                        onSelect={(date) => field.onChange(date)}
                        disabled={(date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage  className='text-red-500'/>
                </FormItem>
              )}
            />
            <Button className="primary-gradient min-h-[46px] px-4 py-3 !text-light-900" type="button" onClick={() => remove(index)}>Remove</Button>
          </div>
        ))}

        <Button 
          className="primary-gradient  w-1/3 px-4 py-3 !text-light-900" 
          type="button" 
          onClick={() => append({ title: "", brandname: "", modelname: "", serialNumber: "", assetTag: "", serviceDate: new Date() })}>
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
                    placeholder='Hawthorn 3.09'
                    {...field} 
                />
              </FormControl>
              <FormMessage  className='text-red-500'/>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="labName"
          render={({ field }) => (
            <FormItem className='flex w-full flex-col gap-3'>
              <FormLabel className='paragraph-semibold text-dark400_light800'>Room/Lab Name </FormLabel>
              <FormControl className='mt-3.5'>
              <Input 
                    className='no-focus paragraph-regular background-light900_dark300 light-border-2 text-dark300_light700 min-h-[56px] border'
                    placeholder='Project Laboratory'
                    {...field} 
                />
              </FormControl>
              
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
                    placeholder='Teaching'
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
              <FormLabel className='paragraph-semibold text-dark400_light800'>Equipment Category <span className='text-primary-500'>*</span></FormLabel>
              <FormControl className='mt-3.5'>
                <Input 
                    // disabled={ type === 'Edit' }
                    className='no-focus paragraph-regular background-light900_dark300 light-border-2 text-dark300_light700 min-h-[56px] border'
                    {...field} 
                    placeholder='Spectrophotometer'
                />
              </FormControl>
              <FormDescription className='body-regular mt-2.5 text-light-500'>
                Equipment a general type to determine their grouping
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
                    placeholder='Analyser not working, do not use until repaired'
                />
              </FormControl>
              <FormDescription className='body-regular mt-2.5 text-light-500'>
               General comments, e.g damages, ownership, new ...
              </FormDescription>
              <FormMessage  className='text-red-500'/>
            </FormItem>
          )}
        />


<FormField
  control={form.control}
  name="imgUrl"
  render={({ field }) => (
    <FormItem className='flex w-full flex-col'>
      <FormLabel className='paragraph-semibold text-dark400_light800'>
        Upload an image <span className='text-primary-500'>*</span>
      </FormLabel>
      <FormControl className='mt-3.5'>
        {imagedata ? (
          <div className='flex flex-col items-center justify-center max-w-[400px] min-w-[100px] max-h-[400px]  min-h-[100px] bg-light900'>
            <Image 
              src={imagedata} 
              alt="equipment image" 
              className='object-contain py-6'
              width={200}
              height={200}
            />
            <Button onClick={() => handleImageDelete(imagedata)} size='icon' variant="ghost" className='text-dark400_light800 right-[-12px] top-0'>
              {imageIsdeleting ? <Loader2/> : <XCircle/>}
            </Button>
          </div>
        ) : (
          <div className='flex flex-col items-center max-w[400px] p-12 border-2 border-dashed border-primary/50 rounded mt-4'>
            <UploadButton
              endpoint="imageUploader"
              onClientUploadComplete={(res: any) => {
                console.log("Files: ", res);
                const uploadedUrl = res[0].url;
                handleImageUpload(uploadedUrl);
                field.onChange(uploadedUrl); // Update form value
                toast({
                  variant: "success",
                  title: "🎉 Image uploaded Successfully!"
                });
              }}
              onUploadError={(error: Error) => {
                toast({
                  variant: "destructive",
                  title: "Error! Upload failed.",
                  description: "Image size is probably too large or you're not signed In"
                });
              }}
            />
          </div>
        )}
      </FormControl>
      <FormDescription className='body-regular mt-2.5 text-light-500'>
        Choose an image for the equipment you&apos;re adding.
      </FormDescription>
      <FormMessage className='text-red-500'/>
    </FormItem>
  )}
/>


{/* 
<Button disabled={isSubmitting} className="primary-gradient w-fit min-h-[46px] px-4 py-3 !text-light-900" type="submit">
  {isSubmitting ? 'Submitting...' : (type === 'Edit' ? 'Edit Equipment' : 'Add Equipment')}
</Button> */}
<Button className="primary-gradient w-fit min-h-[46px] px-4 py-3 !text-light-900" type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Submitting...' : type === 'Edit' ? 'Update Equipment' : 'Add Equipment'}
      </Button>
      </form>
    </Form>
  )
}

export default Equipment;


