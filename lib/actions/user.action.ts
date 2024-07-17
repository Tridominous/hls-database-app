"use server"

import User from "@/database/user.model";
import { connectToDatabase } from "../mongoose"
import { CreateUserParams, DeleteUserParams, GetAllUsersParams, GetSavedEquipmentParams, GetUserByIdParams, GetUserStatsParams, ToggleEquipmentParams, UpdateUserParams } from "./shared.types";
import { revalidatePath } from "next/cache";
import EquipmentCard from "@/database/equipment.model";
import { FilterQuery } from "mongoose";
import Tag from "@/database/tag.model";

export const getUserById = async (params: GetUserByIdParams) => {
    try {
      await  connectToDatabase();
      const {userId} = params;
      const user = await User.findOne({ clerkId: userId});
      return user;

    } catch (error) {
        console.log(error)
        throw error;
    }
}


export const createUser = async (userData: CreateUserParams) => {
  try {
    await  connectToDatabase();
    const newUser = await User.create(userData)

    return newUser;

  } catch (error) {
      console.log('Error creating user:', error)
      throw error;
  }
}


export const updateUser = async (params: UpdateUserParams) => {
  try {
    await  connectToDatabase();
    const { clerkId, updateData, path } = params;
    await User.findOneAndUpdate({clerkId}, updateData, {new: true})

    revalidatePath(path)

  } catch (error) {
      console.log(error)
      throw error;
  }
}

export const deleteUser = async (params: DeleteUserParams) => {
  try {
    await  connectToDatabase();
    const { clerkId } = params;
    const user = await User.findOne({clerkId})

    if(!user){
      throw new Error('User not found')
    }

    // Dissociate equipment from the user
    await EquipmentCard.updateMany({ author: user._id }, { $unset: { author: "" } });

    // Now delete the user
    const deletedUser = await User.findByIdAndDelete(user._id);
    return deletedUser;

  } catch (error) {
      console.log("Error in deleteUser", error)
      throw error;
  }
}


export const getAllUsers = async (params: GetAllUsersParams) => {
  try {
    await  connectToDatabase();
    // const { page = 1, pageSize = 20, filter, searchQuery } = params;

    const users = await User.find({})
    .sort({createdAt: -1})

      return {users};

  } catch (error) {
    console.log("Error in getAllUsers", error)
    throw error;
  }
}


export async function toggleSaveEquipment(params: ToggleEquipmentParams) {
  try {
    await connectToDatabase();

    const { userId, equipmentId, path } = params;

    const user = await User.findById(userId);

    if(!user) {
      throw new Error('User not found');
    }

    const isEquipmentSaved = user.saved.includes(equipmentId);

    if(isEquipmentSaved) {
      // remove equipment from saved
      await User.findByIdAndUpdate(userId, 
        { $pull: { saved: equipmentId }},
        { new: true }
      )
    } else {
      // add equipment to saved
      await User.findByIdAndUpdate(userId, 
        { $addToSet: { saved: equipmentId }},
        { new: true }
      )
    }

    revalidatePath(path)
  } catch (error) {
    console.log(error);
    throw error;
  }
}


export const getSavedEquipment = async (params: GetSavedEquipmentParams) => {
  try {
    await connectToDatabase();

    const { clerkId, searchQuery, filter, page = 1, pageSize = 20 } = params;

    const skipAmount = (page - 1) * pageSize;
    
    const query: FilterQuery<typeof EquipmentCard> = searchQuery
      ? { title: { $regex: new RegExp(searchQuery, 'i') } }
      : { };

      let sortOptions = {};

      switch (filter) {
        case "most_recent":
          sortOptions = { createdAt: -1 }
          break;
        case "oldest":
          sortOptions = { createdAt: 1 }
          break;
        case "most_viewed":
          sortOptions = { views: -1 }
          break;
      
        default:
          break;
      }

    const user = await User
    .findOne({ clerkId })
    .populate({
      path: 'saved',
      match: query,
      options: {
        sort: sortOptions,
        skip: skipAmount,
        limit: pageSize + 1,
      },
      populate: [
        { path: 'tag', model: Tag, select: "_id name" },
        { path: 'author', model: User, select: '_id clerkId name picture'}
      ]
    })

    const isNext = user.saved.length > pageSize;
    
    if(!user) {
      throw new Error('User not found');
    }

    const savedEquipment = user.saved;

    return { equipment: savedEquipment, isNext };

  } catch (error) {
    console.log("Error fetching saved equipment", error);
    throw error;
  }
}

export const getUserInfo = async (params:  GetUserByIdParams) => {
  try {
    await connectToDatabase();
    
    const { userId } = params;

    const user = await User.findOne({clerkId: userId})

    if(!user){
      throw new Error('User not found')
    }

    const totalEquipment = await EquipmentCard.countDocuments({ author: user._id})

    return {
      user,
      totalEquipment
    }
  } catch (error) {
    console.log("Error fetching user info", error);
    throw error;
  }
}


export const getUserEquipment = async (params: GetUserStatsParams) => {
  try {
    await connectToDatabase();

    const {userId, page= 1, pageSize = 10} = params;

    const totalEquipment = await EquipmentCard.countDocuments({author: userId});

    const userEquipment = await EquipmentCard.find({author: userId})
    .sort({views: -1})
    .populate('tag', '_id name')
    .populate('author', '_id clerkId name picture')

    return { totalEquipment, userEquipment}
  } catch (error) {
    console.log("Error fetching user equipment", error);
    throw error;
    
  }
}