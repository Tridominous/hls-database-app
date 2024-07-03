"use server";

import { connectToDatabase } from "../mongoose";

export async function createEquipment (params: any) {
    try {
        // connect to DB
     await connectToDatabase();

    } catch (error) {
        
    }
}