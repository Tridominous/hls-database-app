"use server";

import EquipmentCard from "@/database/equipment.model";
import { connectToDatabase } from "../mongoose";
import Tag from "@/database/tag.model";
import User from "@/database/user.model";
import { GetEquipmentParams, CreateEquipmentParams } from "./shared.types";
import { Schema } from "mongoose";
import { EquipmentCardProps } from "@/components/cards/EquipmentCard";


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
