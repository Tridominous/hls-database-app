"use client";

import Image from 'next/image';
import Link from 'next/link';
import React from 'react'
import RenderTag from './RenderTag';

const hotEquipment = [
    {_id: "1", title: "HPLC"},
    {_id: "2", title: "Spectrophotometer"},
    {_id: "3", title: "Microscope"},
    {_id: "4", title: "Hotplate"},
    {_id: "5", title: "NMR"},
];

const popularTags = [
    {_id: "1", name: 'HPLC', totalEquipment: 5},
    {_id: "2", name: 'Microscope', totalEquipment: 12},
    {_id: "3", name: 'Spectrometer', totalEquipment: 20},
    {_id: "4", name: 'Cylinder', totalEquipment: 21},
    {_id: "5", name: 'Pipette', totalEquipment: 7},
];
const RightSidebar = () => {

  return (
    <section className='background-light900_dark200 light-border sticky right-0 top-0 flex h-screen w-[350px] flex-col overflow-y-auto border-l p-6 pt-36 shadow-light-300 max-xl:hidden dark:shadow-none'>
        <div>
            <h3 className='h3-bold text-dark200_light900'>
                Top Equipment
            </h3>
            <div className='mt-7 flex w-full flex-col gap-[30px]'>
                {hotEquipment.map((equipment) => (
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
                Popular Tags
            </h3>
            <div className='mt-7 flex flex-col gap-4'>
                {popularTags.map((tag) => (
                    <RenderTag
                        key={tag._id}
                        name={tag.name}
                        totalEquipment={tag.totalEquipment}
                        showCount
                    />

                ))}
            </div>
        </div>
    
    </section>
  )
}

export default RightSidebar