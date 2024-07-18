import Equipment from '@/components/forms/Equipment'
import { getEquipmentById } from '@/lib/actions/equipment.action';
import { getUserById } from '@/lib/actions/user.action';
import { ParamsProps } from '@/types';
import { auth } from '@clerk/nextjs/server'
import React from 'react'

const Page = async ({params}: ParamsProps) => {
  const { userId} = auth();

  if(!userId) return null;

  const mongoUser = await getUserById({userId});
  const result = await getEquipmentById({equipmentId: params.id})
  
  return (
    <>
      <h1 className='h1-bold text-dark100_light900'>Eqit Equipment</h1>

      <div className='mt-9'>
        <Equipment
          type="Edit"
          mongoUserId={mongoUser._id.toString()}
          equipmentDetails={JSON.stringify(result)}
          />
      </div>
    </>
  )
}

export default Page;