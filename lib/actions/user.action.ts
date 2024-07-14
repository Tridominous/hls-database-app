"use server"

import User from "@/database/user.model";
import { connectToDatabase } from "../mongoose"
import { CreateUserParams, DeleteUserParams, GetAllUsersParams, GetUserByIdParams, ToggleEquipmentParams, UpdateUserParams } from "./shared.types";
import { revalidatePath } from "next/cache";
import EquipmentCard from "@/database/equipment.model";

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
    const user = await User.findOneAndDelete({clerkId})

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
    const { page = 1, pageSize = 20, filter, searchQuery } = params;

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