import EquipmentTab from '@/components/shared/EquipmentTab';
import { Button } from '@/components/ui/button';
import { getUserInfo } from '@/lib/actions/user.action';
import { getJoinedDate } from '@/lib/utils';
import { URLProps } from '@/types';
import { SignedIn } from '@clerk/nextjs';
import { auth } from '@clerk/nextjs/server';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react'

const Page = async ({params, searchParams}: URLProps) => {
    const { userId: clerkId} = auth();
    // const {user, totalEquipment} = await getUserInfo({userId: params.id});
    let user, totalEquipment;
    try {
    ({ user, totalEquipment } = await getUserInfo({userId: params.id}));
    } catch (error) {
    return <div className='paragraph-regular text-dark200_light800'>
        User not found | You can find the user in the community page
    </div>;
    }

    
  return (
    <>
        <div className='flex flex-col-reverse items-start justify-between sm:flex-row'>
            <div className='flex flex-col items-start gap-4 lg:flex-row'>
                <Image
                   src={user.picture}
                   alt={user.name}
                   width={140}
                   height={140}
                   className='rounded-full object-cover'
                />
                <div className='mt-3'>
                    <h2 className='h2-bold text-dark100_light900'>{user.name}</h2>
                    <p className='paragraph-regular text-dark200_light800'>{user.username}</p>
                    <p className='paragraph-regular text-dark200_light800'>{user.email}</p>
                        
                    <div className='mt-5 flex flex-wrap items-center justify-start gap-5 text-dark200_light800'>
                        Joined on {getJoinedDate({ date: user.joinedAt })}
                    </div>
                    
                    {user.bio && (
                        <p className='paragraph-regular text-dark200_light800 mt-3'>
                            {user.bio}
                        </p>
                    )}
                    <p className='paragraph-regular text-dark200_light800'>Total Equipment: {totalEquipment}</p>
                </div>
            </div>
            <div className='flex justify-end max-sm:mb-5 max-sm:w-full sm:mt-3'>
                <SignedIn>
                    {
                        clerkId === user.clerkId && (
                           <Link href='/profile/edit' className='btn btn-primary'>
                               <Button className='paragraph-medium btn-secondary text-dark300_light900 min-h-[46px] min-w-[175px] px-4 py-3'>
                                Edit Profile
                                </Button>
                           </Link>
                        )
                    }
                </SignedIn>
            </div>
        </div>
        <div className='mt-10 flex flex-col'>
            <h2 className='h2-bold text-dark100_light900 mb-5'>Equipment</h2>
            <div className='w-full'>
                <EquipmentTab 
                searchParams={searchParams} 
                userId={user._id} 
                clerkId={user.clerkId}
                />
            </div>
        </div>
    </>
  )
}

export default Page;