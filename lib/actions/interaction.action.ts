"use server";

import { connectToDatabase } from "../mongoose";
import EquipmentCard from "@/database/equipment.model";
import { ViewEquipmentParams } from "./shared.types";
import Interaction from "@/database/interaction.model";


export const viewEquipment = async (params: ViewEquipmentParams) => {

    try {
        await connectToDatabase();

        const { equipmentId, userId} = params;

        // update view count for the equipment
        await EquipmentCard.findByIdAndUpdate(equipmentId, { $inc: { views: 1}});

        if(userId){
            const existingInteraction = await Interaction.findOne({
                user: userId,
                action: 'view',
                equipment: equipmentId

            })

            if(existingInteraction) return console.log('User has already viewed.');

            // create interaction
            await Interaction.create({
                user: userId,
                action: 'view',
                equipment: equipmentId
            })
        }
     
    } catch (error) {
        console.log(error)
        throw error;
    }
}