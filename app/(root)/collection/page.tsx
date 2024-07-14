// "use client"

import EquipmentCard, { EquipmentCardProps } from "@/components/cards/EquipmentCard";
import Filter from "@/components/shared/Filter";
import NoResult from "@/components/shared/NoResult";
import LocalSearchbar from "@/components/shared/search/LocalSearchbar";
import { EquipmentFilters } from "@/constants/filters";
import { getEquipment } from "@/lib/actions/equipment.action";
import { getSavedEquipment } from "@/lib/actions/user.action";
import { auth } from "@clerk/nextjs/server";



 
export default  async function collection() {

  const { userId } = auth();

  if(!userId) return null;

  const result = await getSavedEquipment({
    clerkId: userId
  });


  console.log(result)
  return (
    <>
      <h1 className="h1-bold text-dark100_light900">Saved Equipment</h1>

      <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearchbar
          route="/"
          iconPosition="left"
          imgSrc="/assets/icons/search.svg"
          placeholder="Search for Equipment"
          otherClasses="flex-1"
        />

        <Filter
          filters={EquipmentFilters}
          otherClasses="min-h-[56px] sm:min-w-[170px]"
          containerClasses="hidden max-md:flex"
        />
      </div>


      <div className="mt-10 flex w-full flex-col gap-6">
        {/* loop through equipment */}
        {result.equipment.length > 0 ? 
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
          title="There&apos;re no saved equipment to show"
          description="Be the first to add this equipment!"
          link="/add-equipment"
          linkTitle="Add an Equipment"
        />}
      </div>
    </>
  )
}