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

        const { searchQuery, filter, page = 1, pageSize = 10 } = params;
        const skipAmount = (page - 1) * pageSize;

        const query: FilterQuery<typeof Tag> = {}
        if (searchQuery) {
            query.$or = [
                { name: { $regex: searchQuery, $options: 'i' } },
            ]
        }

        let sortOptions = {};

        switch (filter) {
          case "popular":
            sortOptions = { Equipment: -1 }
            break;
          case "recent":
            sortOptions = { createdAt: -1 }
            break;
          case "name":
            sortOptions = { name: 1 }
            break;
            case "oldest":
                sortOptions = { createdAt: 1 }
                break;
        
          default:
            break;
        }

        const tags = await Tag.find(query)
        .sort(sortOptions)
        .skip(skipAmount)
        .limit(pageSize)

        const totalTags = await Tag.countDocuments(query);

        const isNext = totalTags > skipAmount + tags.length

        return {tags, isNext}

    } catch (error) {
        console.log('Error getting tags', error)
        throw error;
    }

}

export const getEquipmentByTagId = async (params: GetEquipmentByTagIdParams) => {
    try {
        await connectToDatabase();

        const {tagId, page = 1, pageSize = 10, searchQuery} = params
        const skipAmount = (page - 1) * pageSize;

        const tagFilter: FilterQuery<ITag> = { _id: tagId};

        const tag = await Tag.findOne(tagFilter).populate({
        path: 'Equipment',
        model: EquipmentCard,
        match: searchQuery
            ? { title: { $regex: searchQuery, $options: 'i' }}
            : {},
        options: {
            sort: { createdAt: -1 },
            skip: skipAmount,
            limit: pageSize  + 1
        },
        populate: [
            { path: 'tag', model: Tag, select: "_id name" },
            { path: 'author', model: User, select: '_id clerkId name picture'}
        ]
        })

        if(!tag) {
        throw new Error('Tag not found');
        }

        const isNext = tag.Equipment.length > pageSize;

        const equipment = tag.Equipment;

        return { tagTitle: tag.name, equipment, isNext};

    } catch (error) {
        console.log('Error getting tags', error)
        throw error;  
    }
}


export const getTopEquipmentTags = async () => {
 try {
    await connectToDatabase();

    const topTags = await Tag.aggregate([
       { $project: { name: 1, numberOfEquipment: { $size: "$Equipment"}}},
       { $sort: { numberOfEquipment: -1}},
       { $limit: 10}
    ])
    

        return topTags
 } catch (error) {
    console.log('Error getting tags', error)
    throw error;
  
 }
}