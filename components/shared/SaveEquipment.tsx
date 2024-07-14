"use client";

import { usePathname, useRouter } from 'next/navigation';
import { toast } from '../ui/use-toast';
import React, { useEffect } from 'react'
import Image from 'next/image';
import { toggleSaveEquipment } from '@/lib/actions/user.action';
import { viewEquipment } from '@/lib/actions/interaction.action';

interface Props {
    type: string;
    itemId: string;
    userId: string;
    hasSaved? : boolean;
}
const SaveEquipment = ({
    type,
    itemId,
    userId,
    hasSaved
}: Props) => {
    const pathname = usePathname();
    const router = useRouter();

    const handleSave = async () => {
        await toggleSaveEquipment({
            userId: JSON.parse(userId),
            equipmentId: JSON.parse(itemId),
            path: pathname,
        })

        return toast({
            title: `Equipment ${!hasSaved ? 'Saved in' : 'Removed from'} your collection`,
            variant: !hasSaved ?  'success' : 'success',
        })
    }

    useEffect(() => {
     viewEquipment({
      equipmentId: JSON.parse(itemId),
      userId: userId ? JSON.parse(userId) : undefined,

     })
   
    }, [itemId, userId])

  return (
    <div className="flex gap-5">
      {type === 'Equipment' && (
        <Image 
          src={hasSaved
            ? '/assets/icons/star-filled.svg'
            : '/assets/icons/star-red.svg'
          }
          width={18}
          height={18}
          alt="star"
          className="cursor-pointer"
          onClick={handleSave}
        />
      )}
    </div>
  )
}

export default SaveEquipment