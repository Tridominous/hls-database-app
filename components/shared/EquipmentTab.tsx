import { getUserEquipment } from '@/lib/actions/user.action';
import { SearchParamsProps } from '@/types'
import React from 'react'
import EquipmentCard from '../cards/EquipmentCard';

interface Props extends SearchParamsProps{
    userId: string;
    clerkId?: string | null;
}

const EquipmentTab = async ({searchParams, userId, clerkId}: Props) => {
    try {
        const result = await getUserEquipment({
            userId: userId,
            page: 1
        })

        if (result.userEquipment.length === 0) {
            return <p>No equipment found.</p>
        }

        return (
            <div>
                {result.userEquipment.map((equipment) => (
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
                        tag={equipment.tag && (typeof equipment.tag === 'string' ? equipment.tag : equipment.tag.name)}
                        author={equipment.author}
                        views={equipment.views}
                        createdAt={new Date(equipment.createdAt)}
                    />
                ))}
            </div>
        )
    } catch (error) {
        console.error('Error fetching user equipment:', error);
        return <p>Error loading equipment. Please try again later.</p>
    }
}

export default EquipmentTab