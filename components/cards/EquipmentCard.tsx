import Link from 'next/link';
import React from 'react'
import RenderTag from '../shared/RenderTag';
import Metric from '../shared/Metric';
import { formatNumber, getTimestamp } from '@/lib/utils';
import Image from 'next/image';

// Define the EquipmentProps interface
export interface EquipmentProps { //different properties like purchasedate, price can be added 
    _id: string;
    imgUrl: string;
    title: string;
    brandname?: string;
    model?: string;
    serialNumber?: string;
    assetTag?: string;
    subunits?: {
        _id: string;
        title: string;
        brandname: string;
        model: string;
        serialNumber: string;
        assetTag: string;
        serviceDate?: Date;
    }[];
    labNumber: string;
    labName?: string;
    team: string;
    serviceDate?: Date;
    comment?: string;
    tag: string;
    author: {
        _id: string;
        name: string;
        picture: string;
    };
    views: number;

    createdAt: Date;
}

// Define the EquipmentCard component
const EquipmentCard = ({
    _id,
    imgUrl,
    title,
    brandname,
    model,
    serialNumber,
    assetTag,
    subunits,
    labNumber,
    labName,
    team,
    serviceDate,
    comment,
    tag,
    author,
    views,
    createdAt,
}: EquipmentProps) => {
  return (
    <div className='card-wrapper rounded-[10px] p-9 sm:px-11 border-separate shadow-lg items-center'>
        <div className='flex flex-col-reverse items-start justify-between gap-5 sm:flex-row'>
            <span className='subtle-regular text-dark400_light700 line-clamp-1 sm:hidden'>
                {getTimestamp(createdAt)}
            </span>
            <Link href={`/equipment/${_id}`}>
                <Image
                    src={imgUrl}
                    alt={`${title} photo missing`}
                    width={150}
                    height={150}
                    className='my-5 ml-0 rounded-[10px] body-medium text-dark400_light800 mx-10 w-full'
                />
                <h3 className='sm:h3-semibold base-semibold text-dark200_light900 line-clamp-1 flex-1'>
                   {title}
                </h3>
                { brandname && <h5 className='body-medium text-dark400_light800'>Brand Name: {brandname}</h5>}
                { model && <h5 className='body-medium text-dark400_light800'>Model Name: {model}</h5>}
                { serialNumber && <h5 className='body-medium text-dark400_light800'>Serial Number: {serialNumber}</h5>}
                { assetTag && <h5 className='body-medium text-dark400_light800'>Asset Tag: {assetTag}</h5>}
                {
                    subunits && subunits.length > 0 && (
                        <ul className='body-medium text-dark400_light800 line-clamp-1 flex-1'> Subunits: 
                            {subunits.map((subunit, index) => (
                                <li className='body-medium text-dark400_light800 mx-10' key={index}>
                                    name: {subunit.title}  
                                    { brandname && <h6>Brand Name: {subunit.brandname}</h6>}  
                                    { model && <h6>Model Name: {subunit.model}</h6>}   
                                    { serialNumber && <h6>Serial Number: {subunit.serialNumber}</h6>} 
                                    { assetTag && <h6>Asset Tag: {subunit.assetTag}</h6>}
                                    <br />
                                </li>
                            ))}
                        </ul>
                    )
                }

                { labNumber && <h5 className='body-medium text-dark400_light800'>Room/Lab Number: {labNumber}</h5>}
                { labName && <h5 className='body-medium text-dark400_light800'>Room/Lab Name: {labName}</h5>}
                { team && <h5 className='body-medium text-dark400_light800'>Team: {team}</h5>}
                { serviceDate && <h5 className='body-medium text-dark400_light800'>Service Date: {serviceDate.toDateString()}</h5>}
                { comment && <h5 className='body-medium text-dark400_light800 line-clamp-1 flex-1'>Comment: {comment}</h5> }
            </Link>
            {/* if signed in add edit delete actions */}
        </div>

        <div className='mt-3.5 flex flex-wrap gap-2'>
           
                <RenderTag name={tag}/>
          
        </div>

            <div className='flex-between mt-6 w-full flex-wrap gap-3'>
                <Metric
                    imgUrl="/assets/icons/avatar.svg"
                    alt="user"
                    value={author.name}
                    title= {` - added ${getTimestamp(createdAt)}`}
                    textStyles="body-medium text-dark400_light800"
                    href={`/profile/${author._id}`}
                    isAuthor
                />


               

                <Metric
                    imgUrl="/assets/icons/eye.svg"
                    alt="eye"
                    value={formatNumber(views)}
                    title= " Views"
                    textStyles="small-medium text-dark400_light800"
                />
            </div>
    </div>
  )
}

export default EquipmentCard;