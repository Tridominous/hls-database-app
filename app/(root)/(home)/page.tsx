

import EquipmentCard, { EquipmentCardProps } from "@/components/cards/EquipmentCard";
import HomeFilters from "@/components/home/HomeFilters";
import Filter from "@/components/shared/Filter";
import NoResult from "@/components/shared/NoResult";
import Pagination from "@/components/shared/Pagination";
import LocalSearchbar from "@/components/shared/search/LocalSearchbar";
import { Button } from "@/components/ui/button";
import { HomePageFilters } from "@/constants/filters";
import { getEquipment } from "@/lib/actions/equipment.action";
import { SearchParamsProps } from "@/types";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Home | HLS Equipment",
}

  
 
export default  async function Home({searchParams}: SearchParamsProps) {
  const { equipmentCards, isNext, totalEquipment } = await getEquipment({
    searchQuery: searchParams.q,
    filter: searchParams.filter,
    page: searchParams.page ? +searchParams.page : 1,
  });


  console.log(equipmentCards)
  return (
    <>
      <div className="flex w-full flex-col-reverse justify-between gap-4 sm:items-center">
        <h1 className="h1-bold text-dark100_light900">All Equipment</h1>
          

        <Link href="/add-equipment" className="flex justify-end max-sm:w-full">
          <Button className="primary-gradient min-h-[46px] px-4 py-3 !text-light-900">
            Add an Equipment
          </Button>
        </Link>
      </div>
      <h3 className=" text-dark100_light900">Total Equipment in the Database: {totalEquipment}</h3>

      <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearchbar
          route="/"
          iconPosition="left"
          imgSrc="/assets/icons/search.svg"
          placeholder="Search for Equipment"
          otherClasses="flex-1"
        />

        <Filter
          filters={HomePageFilters}
          otherClasses="min-h-[56px] sm:min-w-[170px]"
          containerClasses="hidden max-md:flex"
        />
      </div>

      <HomeFilters/>

      <div className="mt-10 flex w-full flex-col gap-6">
        {/* loop through equipment */}
        {equipmentCards.length > 0 ? equipmentCards.map((equipment) => (
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
            tag={equipment.tag}
            author={equipment.author}
            
            views={equipment.views}
            createdAt={new Date(equipment.createdAt)}
         />
        )): 
        <NoResult
          title="There&apos;re no equipment to show"
          description="Be the first to add this equipment!"
          link="/add-equipment"
          linkTitle="Add an Equipment"
        />}
      </div>
      
      <div className="mt-10">
        <Pagination
          pageNumber={searchParams?.page ? +searchParams.page : 1}
          isNext={isNext}
        />
      </div>
    </>
  )
}