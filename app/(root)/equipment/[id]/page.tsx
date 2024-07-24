import Metric from '@/components/shared/Metric'
import RenderTag from '@/components/shared/RenderTag'
import SaveEquipment from '@/components/shared/SaveEquipment'
import { getEquipmentById } from '@/lib/actions/equipment.action'
import { getUserById } from '@/lib/actions/user.action'
import { formatNumber, getTimestamp } from '@/lib/utils'
import { auth } from '@clerk/nextjs/server'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const Page = async ({ params, searchParams }: any) => {
   
    const {userId: clerkId} = auth();
    let mongoUser;

    if (clerkId) {
        mongoUser = await getUserById({userId: clerkId});
    }

    const equipment = await getEquipmentById(params.id)
    
    if (!equipment) {
        return <div className='h2-semibold text-dark200_light900'>Equipment not found</div>;
      }
  return (
    <>
        <div className='flex-center w-full flex-col'>
            <div className='flex w-full flex-col-reverse justify-between gap-5 sm:flex-row sm:items-center sm:gap-2'>
                <Link href={`profile/${equipment?.author.clerkId}`}
                className='flex items-center justify-start gap-1'
                >
                    <Image
                    src={equipment?.author.picture || '/assets/images/default_user.png'}
                    width={22}
                    height={22}
                    className='rounded-full'
                    alt='profile'
                    />

                    <p className='paragraph-semibold text-dark300_light700'>
                        {equipment?.author.name}
                    </p>

                </Link>
                <div className='flex justify-items-end'>
                    <SaveEquipment
                        type="Equipment"
                        itemId={JSON.stringify(equipment?._id)}
                        userId={JSON.stringify(mongoUser._id)}
                        hasSaved={mongoUser?.saved.includes(equipment?._id)}
                    />
                </div>
            </div>
            <h2 className='h2-semibold text-dark200_light900 mt-3.5 w-full text-left'>
                
                <Link href={`/equipment/${equipment?._id}`}>
                <Image
                    src={equipment?.imgUrl || '/assets/images/default_equipment.png'}
                    alt={`${equipment?.title} photo missing`}
                    width={150}
                    height={150}
                    className='my-5 ml-0 rounded-[10px] body-medium text-dark400_light800 mx-10 w-fit'
                />
                <h3 className='sm:h3-semibold base-semibold text-dark200_light900 flex-1'>
                   {equipment?.title}
                </h3>
                {equipment?.brandname && <h5 className='body-medium text-dark400_light800'>Brand Name: {equipment.brandname}</h5>}
                {equipment?.modelname && <h5 className='body-medium text-dark400_light800'>Model Name: {equipment.modelname}</h5>}
                {equipment?.serialNumber && <h5 className='body-medium text-dark400_light800'>Serial Number: {equipment.serialNumber}</h5>}
                {equipment?.assetTag && <h5 className='body-medium text-dark400_light800'>Asset Tag: {equipment.assetTag}</h5>}
                {equipment?.subunits && equipment?.subunits.length > 0 && (
                    <div className='body-medium text-dark400_light800'>
                        <h5>Subunits:</h5>
                        {equipment?.subunits.map((subunit: any) => (
                        <div key={subunit._id} className='mx-10 my-2'>
                            <h6 className='font-semibold'>{subunit.title}</h6>
                            {subunit.brandname && <p>Brand Name: {subunit.brandname}</p>}
                            {subunit.modelname && <p>Model Name: {subunit.modelname}</p>}
                            {subunit.serialNumber && <p>Serial Number: {subunit.serialNumber}</p>}
                            {subunit.assetTag && <p>Asset Tag: {subunit.assetTag}</p>}
                        </div>
                        ))}
                    </div>
                )}

                { equipment?.labNumber && <h5 className='body-medium text-dark400_light800'>Room/Lab Number: {equipment.labNumber}</h5>}
                { equipment?.labName && <h5 className='body-medium text-dark400_light800'>Room/Lab Name: {equipment.labName}</h5>}
                { equipment?.team && <h5 className='body-medium text-dark400_light800'>Team: {equipment.team}</h5>}
                { equipment?.serviceDate && <h5 className='body-medium text-dark400_light800'>Service Date: {equipment.serviceDate instanceof Date ? equipment.serviceDate.toDateString() : 'Invalid Date'}</h5>}
                { equipment?.comment && <h5 className='body-medium text-dark400_light800 line-clamp-1 flex-1'>Comment: {equipment.comment}</h5> }
            </Link>
            </h2>
            <div className='mt-5'>
                <Metric
                        imgUrl="/assets/icons/clock.svg"
                        alt="clock icon"
                        value={` - added ${getTimestamp(equipment?.createdAt)}`}
                        title=""
                        textStyles="body-medium text-dark400_light800"
                />
                <Metric
                        imgUrl="/assets/icons/eye.svg"
                        alt="eye"
                        value={formatNumber(equipment.views)}
                        title= " Views"
                        textStyles="small-medium text-dark400_light800"
                />
            </div>
            
            <div className='mt-8 flex flex-wrap gap-2'>
            {equipment.tag && (
                <RenderTag 
                    key={equipment.tag._id}
                    _id={equipment.tag._id}
                    name={equipment.tag.name}
                    showCount={true}
                />
                )}
            </div>
        </div>
    </>
  )
}

export default Page