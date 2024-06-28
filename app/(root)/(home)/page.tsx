

import EquipmentCard, { EquipmentProps } from "@/components/cards/EquipmentCard";
import HomeFilters from "@/components/home/HomeFilters";
import Filter from "@/components/shared/Filter";
import NoResult from "@/components/shared/NoResult";
import LocalSearchbar from "@/components/shared/search/LocalSearchbar";
import { Button } from "@/components/ui/button";
import { HomePageFilters } from "@/constants/filters";
import Link from "next/link";

const equipments: EquipmentProps[] = [
  {
    _id: "1",
    imgUrl: "/assets/images/HPLC1.JPG",
    title: "Microscope",
    brandname: "Alpha",
    model: "200 series",
    serialNumber: "15635889",
    assetTag: "8090",
    team: "Technical",
    subunits: [
      {
        _id: "1",
        title: "Particle Detector",
        brandname: "Alpha",
        model: "200 series",
        serialNumber: "7990",
        assetTag: "0977",
        serviceDate: new Date("2022-07-18T10:00:00.000Z"),
      },
      {
        _id: "1",
        title: "Particle Detector",
        brandname: "Alpha",
        model: "200 series",
        serialNumber: "7990",
        assetTag: "0977",
      },
    ],
    labNumber: "Hawthon HB 0.13",
    labName: "Chemistry lab",
    serviceDate: new Date("2022-07-18T10:00:00.000Z"),
    tag: "HPLC",
    author: {
      _id: "1",
      name: "Barry Amos",
      picture: "amos.png",
    },
    uses: 20,
    views: 100,
    createdAt: new Date("2022-09-03T12:00:00.000Z"),
  },
  {
    _id: "2",
    imgUrl: "/assets/images/bruker.JPG",
    title: "Centrifuge",
    brandname: "Beta",
    model: "5000X",
    serialNumber: "23847562",
    assetTag: "8091",
    labNumber: "Hawthon HB 0.14",
    labName: "Biology lab",
    team: "Technical",
    serviceDate: new Date("2022-07-18T10:00:00.000Z"),
    comment: "Converter is not functional please do not use, Dangererous!",
    tag: "Biotech",
    author: {
      _id: "2",
      name: "Alice Johnson",
      picture: "alice.png",
    },
    uses: 35,
    views: 150,
    createdAt: new Date("2022-10-12T09:30:00.000Z"),
  },
  {
    _id: "3",
    imgUrl: "/assets/images/bruker.JPG",
    title: "Spectrometer",
    serialNumber: "84756293",
    assetTag: "8092",
    labNumber: "Hawthon HB 0.15",
    labName: "Physics lab",
    team: "Technical",
    tag: "Spectroscopy",
    author: {
      _id: "3",
      name: "John Smith",
      picture: "john.png",
    },
    uses: 50,
    views: 200,
    createdAt: new Date("2022-08-25T11:15:00.000Z"),
  },
  {
    _id: "4",
    imgUrl: "/assets/images/HPLC1.JPG",
    title: "Pipette",
    brandname: "Delta",
    model: "P-20",
    serialNumber: "54673829",
    assetTag: "8093",
    labNumber: "Hawthon HB 0.16",
    labName: "Microbiology lab",
    team: "Technical",
    tag: "Microbiology",
    author: {
      _id: "4",
      name: "Emma Brown",
      picture: "emma.png",
    },
    uses: 10,
    views: 50,
    createdAt: new Date("2022-11-02T13:45:00.000Z"),
  },
  {
    _id: "5",
    imgUrl: "/assets/images/bruker.JPG",
    title: "Incubator",
    brandname: "Epsilon",
    model: "Model 101",
    serialNumber: "34987564",
    assetTag: "8094",
    labNumber: "Hawthon HB 0.17",
    labName: "Genetics lab",
    team: "Teaching",
    tag: "Genetics",
    author: {
      _id: "5",
      name: "Chris White",
      picture: "chris.png",
    },
    uses: 25,
    views: 80,
    createdAt: new Date("2022-07-18T10:00:00.000Z"),
  },
  {
    _id: "6",
    imgUrl: "/assets/images/bruker.JPG",
    title: "Autoclave",
    brandname: "Zeta",
    model: "Sterilizer 300",
    serialNumber: "23759874",
    assetTag: "8095",
    labNumber: "Hawthon HB 0.18",
    labName: "Sterilization lab",
    team: "research",
    tag: "Sterilization",
    author: {
      _id: "6",
      name: "David Clark",
      picture: "david.png",
    },
    uses: 60,
    views: 210,
    createdAt: new Date("2022-09-10T12:30:00.000Z"),
  },
  {
    _id: "7",
    imgUrl: "/assets/images/bruker.JPG",
    title: "Analytical Balance",
    brandname: "Eta",
    model: "A-200",
    serialNumber: "65748392",
    assetTag: "8096",
    labNumber: "Hawthon HB 0.19",
    labName: "Analytical lab",
    team: "Technical",
    tag: "Weighing",
    author: {
      _id: "7",
      name: "Sophia Green",
      picture: "sophia.png",
    },
    uses: 40,
    views: 170,
    createdAt: new Date("2022-10-05T08:45:00.000Z"),
  },
  {
    _id: "8",
    imgUrl: "/assets/images/DMU04.svg",
    title: "Fume Hood",
    brandname: "Theta",
    model: "Safe 3000",
    serialNumber: "34956782",
    assetTag: "8097",
    labNumber: "Hawthon HB 0.20",
    labName: "Chemistry lab",
    team: "Technical",
    tag: "Safety",
    author: {
      _id: "8",
      name: "James Hall",
      picture: "james.png",
    },
    uses: 15,
    views: 90,
    createdAt: new Date("2022-08-15T11:00:00.000Z"),
  },
  {
    _id: "9",
    imgUrl: "/assets/images/bruker.JPG",
    title: "pH Meter",
    brandname: "Iota",
    model: "PH-10",
    serialNumber: "93746528",
    assetTag: "8098",
    labNumber: "Hawthon HB 0.21",
    labName: "Biochemistry lab",
    team: "Technical",
    tag: "Biochemistry",
    author: {
      _id: "9",
      name: "Olivia Lee",
      picture: "olivia.png",
    },
    uses: 30,
    views: 130,
    createdAt: new Date("2022-11-12T09:15:00.000Z"),
  },
  {
    _id: "10",
    imgUrl: "/assets/images/DMU04.svg",
    title: "Freezer",
    brandname: "Kappa",
    model: "Frost-500",
    serialNumber: "12378945",
    assetTag: "8099",
    labNumber: "Hawthon HB 0.22",
    labName: "Cold Storage lab",
    team: "Technical",
    tag: "Storage",
    author: {
      _id: "10",
      name: "Lucas Martin",
      picture: "lucas.png",
    },
    uses: 45,
    views: 160,
    createdAt: new Date("2022-07-20T10:30:00.000Z"),
  },
];
 
export default function Home() {
  return (
    <>
      <div className="flex w-full flex-col-reverse justify-between gap-4 sm:items-center">
        <h1 className="h1-bold text-dark100_light900">All Equipment</h1>

        <Link href="/ask-question" className="flex justify-end max-sm:w-full">
          <Button className="primary-gradient min-h-[46px] px-4 py-3 !text-light-900">
            Add an Equipment
          </Button>
        </Link>
      </div>

      <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearchbar
          route="/"
          iconPosition="left"
          imgSrc="/assets/icons/search.svg"
          placeholder="Search for Questions"
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
        {equipments.length > 0 ? equipments.map((equipment) => (
         <EquipmentCard
            key={equipment._id}
            _id={equipment._id}
            imgUrl={equipment.imgUrl}
            title={equipment.title}
            brandname={equipment.brandname}
            model={equipment.model}
            serialNumber={equipment.serialNumber}
            assetTag={equipment.assetTag}
            subunits={equipment.subunits}
            labNumber={equipment.labNumber}
            labName={equipment.labName}
            team={equipment.team}
            serviceDate={equipment.serviceDate}
            comment={equipment.comment}
            tag={equipment.tag}
            author={equipment.author}
            uses={equipment.uses}
            views={equipment.views}
            createdAt={equipment.createdAt}
         />
        )): 
        <NoResult
          title="There&apos;s no equipment to show to show"
          description="Be the first to add this equipment!"
          link="/add-equipment"
          linkTitle="Add an Equipment"
        />}
      </div>
    </>
  )
}