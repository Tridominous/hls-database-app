"use server"

import User from "@/database/user.model";
import { connectToDatabase } from "../mongoose"
import { GetAllTagsParams, GetTopInteractedTagsParams } from "./shared.types";
import Tag from "@/database/tag.model";

export const getTopTags = async (params: GetTopInteractedTagsParams) => {
    try {
        await connectToDatabase();
        const {userId} = params

        const user = await User.findById(userId)
        if (!user) throw new Error("User not found")
        
        //Find interactions for the user and group by equipment tags
        //Interaction functionality
       
        return [{_id: "1", name: 'tag1'}, {_id: "2", name: 'tag1'}, {_id: "3", name: 'tag1'}]


    } catch (error) {
        console.log('Error getting tags', error)
        throw error;
    }
}

export const getAllTags = async (params: GetAllTagsParams) => {
    try {
        await connectToDatabase();
        const tags = await Tag.find({})
        return {tags}

    } catch (error) {
        console.log('Error getting tags', error)
        throw error;
    }

}