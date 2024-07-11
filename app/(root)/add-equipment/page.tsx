import Equipment from '@/components/forms/Equipment';
import { getUserById } from '@/lib/actions/user.action';
import { auth } from '@clerk/nextjs/server';
import React from 'react'
import { redirect } from 'next/navigation';

const Page = async () => {
  const { userId} = auth();
  
  if (!userId) redirect('/sign-in');

  const mongoUser = await getUserById({userId})
  console.log(mongoUser)
  return (
    <div>
      <h1 className='h1-bold text-dark100_light900'>Add an Equipment</h1>

      <div className='mt-9'>
        <Equipment mongoUserId={JSON.stringify(mongoUser?._id)}/>
      </div>
    </div>
  )
}

export default Page;