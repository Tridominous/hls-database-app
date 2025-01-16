import Equipment from '@/components/forms/Equipment';
import { getEquipmentById } from '@/lib/actions/equipment.action';
import { getUserById } from '@/lib/actions/user.action';
import { ParamsProps } from '@/types';
import { auth } from '@clerk/nextjs/server';
import React from 'react';

const Page = async ({ params }: ParamsProps) => {
  console.log("Rendering Edit Equipment Page");
  console.log("Params:", params);

  const { userId } = auth();

  if (!userId) {
    console.log("No userId found");
    return <div className='text-dark100_light900'>User not authenticated</div>;
  }

  try {
    console.log("Fetching user data for userId:", userId);
    const mongoUser = await getUserById({ userId });

    if (!mongoUser) {
      console.error("MongoDB user not found for Clerk userId:", userId);
      return <div className='text-dark100_light900'>User not found</div>;
    }

    console.log("Fetching equipment details for id:", params.id);
    const equipmentDetails = await getEquipmentById(params.id);

    if (!equipmentDetails) {
      console.error("Equipment not found for id:", params.id);
      return <div className='text-dark100_light900'>Equipment not found</div>;
    }

    console.log("MongoUser:", mongoUser);
    console.log("EquipmentDetails:", equipmentDetails);

    // Ensure equipmentDetails is serializable
    const serializableEquipmentDetails = JSON.stringify(equipmentDetails);
    // console.log("SerializableEquipmentDetails:", serializableEquipmentDetails);

    return (  
      <>
        <h1 className="h1-bold text-dark100_light900">Edit Equipment</h1>
        <div className="mt-9">
          <Equipment
            type="Edit"
            mongoUserId={mongoUser._id.toString()}
            equipmentDetails={serializableEquipmentDetails}
          />
        </div>
      </>
    );
  } catch (error) {
    console.error("Error in Edit Equipment Page:", error);
    return <div className='text-dark100_light900'>An error occurred while loading the page. Please try again.</div>;
  }
};

export default Page;