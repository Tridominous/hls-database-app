"use server"

import User from "@/database/user.model";
import { connectToDatabase } from "../mongoose"
import { GetAllTagsParams, GetEquipmentByTagIdParams, GetTopInteractedTagsParams } from "./shared.types";
import Tag, { ITag } from "@/database/tag.model";
import EquipmentCard from "@/database/equipment.model";
import { FilterQuery } from "mongoose";

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

export const getEquipmentByTagId = async (params: GetEquipmentByTagIdParams) => {
    try {
        await connectToDatabase();

        const {tagId, page = 1, pageSize = 10, searchQuery} = params
        

        const tagFilter: FilterQuery<ITag> = { _id: tagId};

        const tag = await Tag.findOne(tagFilter).populate({
        path: 'Equipment',
        model: EquipmentCard,
        match: searchQuery
            ? { title: { $regex: searchQuery, $options: 'i' }}
            : {},
        options: {
            sort: { createdAt: -1 },
        },
        populate: [
            { path: 'tag', model: Tag, select: "_id name" },
            { path: 'author', model: User, select: '_id clerkId name picture'}
        ]
        })

        if(!tag) {
        throw new Error('Tag not found');
        }

        
        const equipment = tag.Equipment;

        return { tagTitle: tag.name, equipment};

    } catch (error) {
        console.log('Error getting tags', error)
        throw error;  
    }
}
