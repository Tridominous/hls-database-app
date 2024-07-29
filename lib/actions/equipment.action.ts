"use server";

import EquipmentCard, { IEquipmentCard } from "@/database/equipment.model";
import { connectToDatabase } from "../mongoose";
import Tag from "@/database/tag.model";
import User from "@/database/user.model";
import { GetEquipmentParams, CreateEquipmentParams, GetEquipmentByIdParams, DeleteEquipmentParams, EditEquipmentParams } from "./shared.types";
import { EquipmentCardProps } from "@/components/cards/EquipmentCard";
import Interaction from "@/database/interaction.model";
import { revalidatePath } from "next/cache";
import mongoose, { FilterQuery} from "mongoose";

export interface EquipmentResult {
  equipmentCards: EquipmentCardProps[];
  isNext: boolean;
  totalEquipment?: number;
}

export async function getEquipment(params: GetEquipmentParams): Promise<EquipmentResult>  {
    try {
        await connectToDatabase();

        const { searchQuery, filter, page=1, pageSize= 10 } = params;

        // Calculate the number of posts to skip based on the page number and page size
        const skipAmount = (page - 1) * pageSize;

        let query: FilterQuery<typeof EquipmentCard> = {}
        if (searchQuery) {
          const regexQuery = new RegExp(searchQuery, "i");
          query.$or = [
            { title: regexQuery },
            { brandname: regexQuery },
            { 'tag.name': regexQuery }  // Changed this to search in tag name
          ]
        }

        let sortOptions = {}

        switch(filter) {
          case "newest":
            sortOptions = { createdAt: -1 }
            break;
            case "oldest":
              sortOptions = { createdAt: 1 }
              break;
              case "frequent":
                sortOptions = { views: -1 }
                break;
                default:
                  sortOptions = { createdAt: -1 }
                  break;
        }
       

        // If tag is provided, find the tag by name first
        if (params.tag && typeof params.tag === 'string') {
            const tag = await Tag.findOne({ name: params.tag });
            if (tag) {
                query.tag = tag._id ;
            } else {
                // If tag doesn't exist, return empty array
                return {
                  equipmentCards: [],
                  isNext: false
                }
            }
        }

        const equipment = await EquipmentCard.find(query)
        .populate({path: "tag", model: Tag})
        .populate({path: 'author', model: User})
        .lean<EquipmentCardProps[]>()
        .skip(skipAmount)
        .limit(pageSize)
        .sort(sortOptions)

        const totalEquipment = await EquipmentCard.countDocuments(query);

        const isNext = totalEquipment > skipAmount + equipment.length;
        
        // Transform the data to ensure tag is an object with a name property
        const transformedEquipment = equipment.map(item => ({
          ...item,
          _id: item._id.toString(),
          tag: item.tag ? {
            _id: item.tag._id.toString(),
            name: item.tag.name
          } : null,
          author: item.author ? {
            _id: item.author._id.toString(),
            name: item.author.name,
            picture: item.author.picture
          } : null,
          createdAt: new Date(item.createdAt).toISOString(),
        }));
        
        return {
          equipmentCards: JSON.parse(JSON.stringify(transformedEquipment)) as EquipmentCardProps[],
          isNext,
          totalEquipment
        }

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

export interface PopulatedTag {
  _id: string;
  name: string;
}

export interface PopulatedAuthor {
  _id: string;
  clerkId: string;
  name: string;
  picture: string;
}

export interface PopulatedEquipmentCard extends Omit<IEquipmentCard, 'tag' | 'author'> {
  tag: PopulatedTag;
  author: PopulatedAuthor;
}

export const getEquipmentById = async (equipmentId: string): Promise<PopulatedEquipmentCard | null> => {
  try {
      await connectToDatabase();

      if (!equipmentId || !mongoose.Types.ObjectId.isValid(equipmentId)) {
          console.log("Invalid equipment ID");
          return null;
      }

      const equipment = await EquipmentCard.findById(equipmentId)
          .populate<{ tag: PopulatedTag }>({path: 'tag', model: Tag, select: '_id name'})
          .populate<{ author: PopulatedAuthor }>({path: 'author', model: User, select: '_id clerkId name picture'})
          .lean<PopulatedEquipmentCard>();

      if (!equipment) {
          console.log("Equipment not found");
          return null;
      }

      return equipment;
  } catch (error) {
      console.error("Error in getEquipmentById:", error);
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


export async function editEquipment(params: EditEquipmentParams) {
  try {
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

    let equipment = await EquipmentCard.findById(equipmentId);
    if (!equipment) {
      throw new Error('Equipment not found');
    }

    // Update equipment fields
    equipment.set({
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
      imgUrl,
    });

    // Handle tag update
    if (tag !== equipment.tag?.name) {
      const newTag = await Tag.findOneAndUpdate(
        { name: { $regex: new RegExp(`^${tag}$`, 'i') } },
        { $setOnInsert: { name: tag } },
        { upsert: true, new: true }
      );

      if (equipment.tag) {
        await Tag.findByIdAndUpdate(equipment.tag, { $pull: { equipment: equipment._id } });
      }

      equipment.tag = newTag._id;
      await Tag.findByIdAndUpdate(newTag._id, { $addToSet: { equipment: equipment._id } });
    }

    await equipment.save();

    const populatedEquipment = await EquipmentCard.findById(equipment._id).populate('tag');

    revalidatePath(path);

    const result = populatedEquipment.toObject();
    console.log("Data being returned from editEquipment:", result);
    return result

  } catch (error: any) {
    console.error("Error editing equipment:", error);
    throw new Error(`Failed to edit equipment: ${error.message}`);
  }
}


  export const getTopEquipment = async () => {
    try {
      await connectToDatabase();

      const topEquipment = await EquipmentCard.find({})
      .sort({ views: -1 })
      .limit(10)

      return topEquipment
    } catch (error) {
      console.error("Error getting top equipment", error);
      if (error instanceof Error) {
        console.error("Get top equipment Error message:", error.message);
        console.error("Get top equipment Error stack:", error.stack);
        }
        throw error;
      
    }
  }
  