import EquipmentCard from '@/components/cards/EquipmentCard'
import NoResult from '@/components/shared/NoResult'
import LocalSearchbar from '@/components/shared/search/LocalSearchbar'
import { getEquipmentByTagId } from '@/lib/actions/tag.actions'
import { URLProps } from '@/types'
import React from 'react'

const Page = async ({params, searchParams}: URLProps) => {
  const result = await getEquipmentByTagId({
    tagId: params.id,
    page: 1,
    searchQuery: searchParams.q
  })


  return (
    <>
      <h1 className="h1-bold text-dark100_light900">Tagged Equipment</h1>

      <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearchbar
          route="/"
          iconPosition="left"
          imgSrc="/assets/icons/search.svg"
          placeholder="Search for Equipment"
          otherClasses="flex-1"
        />

      </div>


      <div className="mt-10 flex w-full flex-col gap-6">
        {/* loop through equipment */}
        {result.equipment?.length > 0 ? 
          result.equipment.map((equipment: any) => (
            <EquipmentCard
                key={equipment._id?.toString()}
                _id={equipment._id?.toString() ?? ''}
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
        )): 

        <NoResult
          title="There&apos;re no tagged equipment to show"
          description="Add an equipment with this tag"
          link="/add-equipment"
          linkTitle="Add an Equipment"
        />}
      </div>
    </>
  )
}

export default Page