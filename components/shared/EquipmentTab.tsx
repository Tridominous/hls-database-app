import { getUserEquipment } from '@/lib/actions/user.action';
import { SearchParamsProps } from '@/types'
import React from 'react'
import EquipmentCard from '../cards/EquipmentCard';
import Pagination from './Pagination';

interface Props extends SearchParamsProps{
    userId: string;
    clerkId?: string | null;
}

const EquipmentTab = async ({searchParams, userId, clerkId}: Props) => {
    try {
        const {userEquipment, isNext} = await getUserEquipment({
            userId: userId,
            page: searchParams.page ? +searchParams.page : 1
        })

        if (userEquipment.length === 0) {
            return <p>No equipment found.</p>
        }

        return (
            <>
                {userEquipment.map((equipment) => (
                    <EquipmentCard
                        key={equipment._id?.toString()}
                        _id={equipment._id?.toString() ?? ''}
                        clerkId={clerkId}
                        imgUrl={equipment.imgUrl}
                        title={equipment.title}
                        brandname={equipment.brandname}
                        modelname={equipment.modelname}
                        serialNumber={equipment.serialNumber}
                        assetTag={equipment.assetTag}
                        subunits={equipment.subunits}
                        labNumber={equipment.labNumber}
                        labName={equipment.labName}
                        team={equipment.team}
                        serviceDate={equipment.serviceDate ? new Date(equipment.serviceDate) : undefined}
                        comment={equipment.comment}
                        tag={equipment.tag}
                        author={equipment.author}
                        views={equipment.views}
                        createdAt={new Date(equipment.createdAt)}
                    />
                ))}
                <div className='mt-10'>
                    <Pagination
                        pageNumber={searchParams?.page ? +searchParams.page : 1}
                        isNext={isNext}
                    />
                </div>
            </>  
        )
    } catch (error) {
        console.error('Error fetching user equipment:', error);
        return <p>Error loading equipment. Please try again later.</p>
    }
}

export default EquipmentTab