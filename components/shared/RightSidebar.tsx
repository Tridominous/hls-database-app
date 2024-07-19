

import Image from 'next/image';
import Link from 'next/link';
import React from 'react'
import RenderTag from './RenderTag';
import { getTopEquipment } from '@/lib/actions/equipment.action';
import { getTopEquipmentTags } from '@/lib/actions/tag.actions';


const RightSidebar = async () => {
    const topEquipment = await getTopEquipment();
    const topTags = await getTopEquipmentTags();

  return (
    <section className='background-light900_dark200 light-border sticky right-0 top-0 flex h-screen w-[350px] flex-col overflow-y-auto border-l p-6 pt-36 shadow-light-300 max-xl:hidden dark:shadow-none'>
        <div>
            <h3 className='h3-bold text-dark200_light900'>
                Top Equipment
            </h3>
            <div className='mt-7 flex w-full flex-col gap-[30px]'>
                {topEquipment.map((equipment) => (
                    <Link
                        href={`/equipment/${equipment._id}`}
                        key={equipment._id}
                        className='flex cursor-pointer items-center justify-between gap-7'
                    >
                        <p className='body-medium text-dark500_light700'>{equipment.title}</p>
                        <Image
                            src="/assets/icons/chevron-right.svg"
                            alt='chevron right'
                            width={20}
                            height={20}
                            className='invert-colors'
                        />
                    </Link>
                ))}
            </div>
        </div>

        <div className='mt-16'>
            <h3 className='h3-bold text-dark200_light900'>
                Top Equipment Tags
            </h3>
            <div className='mt-7 flex flex-col gap-4'>
                {topTags.map((tag) => (
                    <RenderTag
                        key={tag._id}
                        name={tag.name}
                        totalEquipment={tag.numberOfEquipment}
                        showCount
                    />

                ))}
            </div>
        </div>
    
    </section>
  )
}

export default RightSidebar