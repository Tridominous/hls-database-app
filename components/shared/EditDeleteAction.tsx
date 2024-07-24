"use client";

import React from 'react'
import Image from 'next/image';
import { deleteEquipment } from '@/lib/actions/equipment.action';
import { usePathname, useRouter } from 'next/navigation';

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog"
import { Button } from '../ui/button';
  

interface Props {
    type: string;
    itemId: string;
}
const EditDeleteAction = ({type, itemId}: Props) => {
    const pathname = usePathname();
    const router = useRouter();

    const handleEdit = () => {
        router.push(`/equipment/edit/${JSON.parse(itemId)}`)
    }

    const handleDelete = async () => {
        if(type === 'Equipment') {
            
                await deleteEquipment({ 
                    equipmentId: JSON.parse(itemId), 
                    path: pathname
                });
        }
       
    }

    
  return (
    <div className='flex items-center justify-end gap-3 max-sm:w-full'>
        {type === 'Equipment' && (
            <Image
                src="/assets/icons/edit.svg"
                width={20}
                height={20}
                alt="edit"
                className='cursor-pointer object-contain'
                onClick={handleEdit}
            />
        )}

            
        
            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Image
                            src="/assets/icons/trash.svg"
                            width={20}
                            height={20}
                            alt="delete"
                            className='cursor-pointer object-contain'
                        
                        />
                </AlertDialogTrigger>
                <AlertDialogContent className="max-w-md mx-auto p-6 rounded-lg bg-white dark:bg-gray-800 shadow-lg">
                    <AlertDialogHeader>
                    <AlertDialogTitle className="text-lg font-semibold text-gray-900 dark:text-white">
                        Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                        This action cannot be undone. This will permanently delete the equipment from the database.
                    </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="flex justify-end mt-4 space-x-2">
                    <AlertDialogCancel asChild>
                        <Button
                        variant="outline"
                        className="border-gray-300 text-gray-700 dark:text-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                        Cancel
                        </Button>
                    </AlertDialogCancel>
                    <AlertDialogAction asChild>
                        <Button
                        variant="destructive"
                        className="bg-red-500 text-white hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 dark:text-white"
                        onClick={handleDelete}
                        >
                        Continue
                        </Button>
                    </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
    </div>
  )
}

export default EditDeleteAction