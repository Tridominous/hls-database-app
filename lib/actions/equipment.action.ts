"use server";

import EquipmentCard from "@/database/equipment.model";
import { connectToDatabase } from "../mongoose";
import Tag from "@/database/tag.model";
import User from "@/database/user.model";
import { GetEquipmentParams, CreateEquipmentParams, GetEquipmentByIdParams, DeleteEquipmentParams, EditEquipmentParams } from "./shared.types";
import { EquipmentCardProps } from "@/components/cards/EquipmentCard";
import Interaction from "@/database/interaction.model";
import { revalidatePath } from "next/cache";
import { Types } from "mongoose";


export async function getEquipment(params: GetEquipmentParams): Promise<EquipmentCardProps[]> {
    try {
        await connectToDatabase();

        let query = {};

        // If tag is provided, find the tag by name first
        if (params.tag && typeof params.tag === 'string') {
            const tag = await Tag.findOne({ name: params.tag });
            if (tag) {
                query = { tag: tag._id };
            } else {
                // If tag doesn't exist, return empty array
                return [];
            }
        }

        const equipment = await EquipmentCard.find(query)
        .populate({path: "tag", model: Tag})
        .populate({path: 'author', model: User})
        .lean()
        
        // Transform the data to ensure tag is an object with a name property
        const transformedEquipment = equipment.map(item => ({
            ...item,
            tag: typeof item.tag === 'string' ? { name: item.tag } : item.tag
        }));
        
        return JSON.parse(JSON.stringify(transformedEquipment)) as EquipmentCardProps[];

    } catch (error) {
        console.log(error)
        throw error
    }
}

export async function createEquipment (params: CreateEquipmentParams) {
    
    try {
        // connect to DB
     await connectToDatabase();

     const {
        title,
        brandname,
        modelname,
        serialNumber,
        assetTag,
        subunits, 
        labNumber,
        labName,
        team,
        serviceDate,
        comment,
        tag,
        imgUrl,
        author,
        path
     } = params;

      // First, find or create the tag
      let existingTag = await Tag.findOne({ name: { $regex: new RegExp(`^${tag}$`, "i") } });

      if (!existingTag) {
          existingTag = await Tag.create({ name: tag });
      }

    //create equipment
    const  equipment = await EquipmentCard.create({
        title,
        brandname,
        modelname,
        serialNumber,
        assetTag,
        subunits,
        labNumber,
        labName,
        team,
        serviceDate,
        tag: existingTag._id, // Use the tag's ObjectId
        comment,
        imgUrl,
        author,
        path  
    })

    // Update the tag with the new equipment's ID
    await Tag.findByIdAndUpdate(existingTag._id, {
        $addToSet: { Equipment: equipment._id }
    });

    const plainEquipment = equipment.toObject();
    const serializedEquipment = JSON.parse(JSON.stringify(plainEquipment))
    return serializedEquipment;

    // create an interaction record for the user's add-equipment action

    
    } catch (error) {
        console.log(error)
        throw error;
    }
}

export const getEquipmentById = async (params: GetEquipmentByIdParams) => {
    try {
        await connectToDatabase()

        const { equipmentId } = params;

        const equipment = await EquipmentCard.findById(equipmentId)
        .populate({path: 'tag', model: Tag, select: '_id name'})
        .populate({path: 'author', model: User, select: '_id clerkId name picture'})

        return equipment;
    } catch (error) {
        console.log(error)
        throw error;
    }
}

export const deleteEquipment = async (params: DeleteEquipmentParams) => {
    try {
        await connectToDatabase();

        const { equipmentId, path} = params;

        await EquipmentCard.deleteOne({_id: equipmentId});
        await Interaction.deleteMany({equipment: equipmentId});
        await Tag.updateMany({Equipment: equipmentId}, {$pull: {Equipment: equipmentId}})
        
        revalidatePath(path)
    } catch (error) {
        console.log("Error deleting the equipment", error)
        throw error;
    }
}


// export const editEquipment = async (params: EditEquipmentParams) => {
//     try {
//         await connectToDatabase();

//         const {
//             equipmentId,
//             title,
//             brandname,
//             modelname,
//             serialNumber,
//             assetTag,
//             subunits,
//             labNumber,
//             labName,
//             team,
//             serviceDate,
//             comment,
//             imgUrl,
//             path
//         } = params;

//         const equipment = await EquipmentCard.findById(new Types.ObjectId(equipmentId));

//         if (!equipment) {
//             throw new Error('Equipment not found');
//         }

//         // Update the equipment fields
//         equipment.title = title;
//         equipment.brandname = brandname;
//         equipment.modelname = modelname;
//         equipment.serialNumber = serialNumber;
//         equipment.assetTag = assetTag;
//         equipment.subunits = subunits;
//         equipment.labNumber = labNumber;
//         equipment.labName = labName;
//         equipment.team = team;
//         equipment.serviceDate = serviceDate;
//         equipment.comment = comment;
//         equipment.imgUrl = imgUrl;


//         const updatedEquipment = await equipment.save();
        
//         revalidatePath(path);
//         return updatedEquipment.toObject();

//     } catch (error) {
//         console.error("Error editing the equipment", error);
//         if (error instanceof Error) {
//             console.error("Edit func Error message:", error.message);
//             console.error("Edit func Error stack:", error.stack);
//         }
//         throw error;
//     }
// }


// import { Tag, EquipmentCard } from './your-models-file';
// import { connectToDatabase } from './your-database-connection-file';
// import { Types } from 'mongoose';
// import { revalidatePath } from 'next/cache';

export async function editEquipment(params: EditEquipmentParams) {
    try {
        // Connect to DB
        await connectToDatabase();

        const {
            equipmentId,
            title,
            brandname,
            modelname,
            serialNumber,
            assetTag,
            subunits,
            labNumber,
            labName,
            team,
            serviceDate,
            comment,
            tag,
            imgUrl,
            path
        } = params;

        // Find the equipment
        const equipment = await EquipmentCard.findById(new Types.ObjectId(equipmentId));

        if (!equipment) {
            throw new Error('Equipment not found');
        }

        // Handle tag update
        if (tag) {
            let existingTag = await Tag.findOne({ name: { $regex: new RegExp(`^${tag}$`, "i") } });

            if (!existingTag) {
                existingTag = await Tag.create({ name: tag });
            }

            // Remove equipment from old tag
            if (equipment.tag) {
                await Tag.findByIdAndUpdate(equipment.tag, {
                    $pull: { Equipment: equipment._id }
                });
            }

            // Update equipment with new tag
            equipment.tag = existingTag._id;

            // Add equipment to new tag
            await Tag.findByIdAndUpdate(existingTag._id, {
                $addToSet: { Equipment: equipment._id }
            });
        }

        // Update the equipment fields
        Object.assign(equipment, {
            title,
            brandname,
            modelname,
            serialNumber,
            assetTag,
            subunits,
            labNumber,
            labName,
            team,
            serviceDate,
            comment,
            imgUrl
        });

        // Save the updated equipment
        const updatedEquipment = await equipment.save();

        // Revalidate the path
        revalidatePath(path);

        // Convert to plain object and serialize
        const plainEquipment = updatedEquipment.toObject();
        const serializedEquipment = JSON.parse(JSON.stringify(plainEquipment));

        return serializedEquipment;

    } catch (error) {
        console.error("Error editing the equipment", error);
        if (error instanceof Error) {
            console.error("Edit func Error message:", error.message);
            console.error("Edit func Error stack:", error.stack);
        }
        throw error;
    }
}