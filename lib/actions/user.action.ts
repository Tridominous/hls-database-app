"use server"

import User from "@/database/user.model";
import { connectToDatabase } from "../mongoose"
import { CreateUserParams, DeleteUserParams, UpdateUserParams } from "./shared.types";
import { revalidatePath } from "next/cache";
import EquipmentCard from "@/database/equipment.model";

export const getUserById = async (params: any) => {
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
      console.log(error)
      throw error;
  }
}


export const UpdateUser = async (params: UpdateUserParams) => {
  try {
    await  connectToDatabase();
    const { clerkId, updateData, path } = params;
    await User.findByIdAndUpdate({clerkId}, updateData, {new: true})

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
      console.log(error)
      throw error;
  }
}
