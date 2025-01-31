"use server"

import User, { IUser } from "@/database/user.model";
import { connectToDatabase } from "../mongoose"
import { CreateUserParams, DeleteUserParams, GetAllUsersParams, GetSavedEquipmentParams, GetUserByIdParams, GetUserStatsParams, ToggleEquipmentParams, UpdateUserParams } from "./shared.types";
import { revalidatePath } from "next/cache";
import EquipmentCard from "@/database/equipment.model";
import { FilterQuery } from "mongoose";
import Tag from "@/database/tag.model";
import { v4 as uuidv4 } from 'uuid'; // To generate a unique Clerk ID

export const getUserById = async (params: GetUserByIdParams) => {
    try {
      await  connectToDatabase();
      const { userId } = params;
        console.log("Searching for user with clerkId:", userId);

        const user = await User.findOne({ clerkId: userId });

        if (!user) {
            console.log("No user found with clerkId:", userId);
            throw new Error("User not found");
        }
        console.log("User found:", user);
      return user;

    } catch (error) {
        console.log("User not found by Id", error)
        throw error;
    }
}


export const createUser = async (userData: CreateUserParams) => {
  try {
    await  connectToDatabase();
    // const newUser = await User.create(userData)
     // Check the email domain
     const emailDomain = userData.email.split('@')[1];
     if (emailDomain === 'dmu.ac.uk') {
       userData.role = 'admin';
     } else {
       userData.role = userData.role || 'user'; // Set the default role if not provided
     }
 
     const newUser = await User.create(userData);

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

      // Email address to search for
    const searchEmail = "niran.patel@dmu.ac.uk";

    // Try to find the user with the specified email
    let fallbackUser = await User.findOne({ email: searchEmail });

    if (!fallbackUser) {
      // If user not found, create a new user to be the fallback author
      fallbackUser = new User({
        clerkId: uuidv4(), // Generate a unique Clerk ID
        name: "James Mou",
        username: 'Jmou',
        email: "p2719695@my365.dmu.ac.uk",
      });

      await fallbackUser.save();
    }
    // Dissociate equipment from the user
    await EquipmentCard.updateMany({ author: user._id }, { $unset: { author: fallbackUser._id } });

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
   
    const { searchQuery, filter, page=1, pageSize = 9 } = params;
    const skipAmount = (page - 1) * pageSize;

    const query: FilterQuery<typeof User> = {};
    if (searchQuery) {
      query.$or = [
        { name: { $regex: searchQuery, $options: "i" } },
        { email: { $regex: searchQuery, $options: "i" } },
      ]
    }

    let sortOptions = {};

    switch (filter) {
      case "new_users":
        sortOptions = { joinedAt: -1 }
        break;
      case "old_users":
        sortOptions = { joinedAt: 1 }
        break;
    
      default:
        sortOptions = { joinedAt: -1 }
        break;
    }
    const users = await User.find(query)
    .sort(sortOptions)
    .skip(skipAmount)
    .limit(pageSize)

    const totalUsers = await User.countDocuments(query);
    const isNext = totalUsers > skipAmount + users.length;

    const serializedUsers = users.map(user => {
      const plainUser = user.toObject(); // Convert to a plain JavaScript object
      return {
        _id: plainUser._id.toString(), // Convert ObjectId to string
        clerkId: plainUser.clerkId.toString(),
        name: plainUser.name,
        username: plainUser.username,
        email: plainUser.email,
        bio: plainUser.bio,
        picture: plainUser.picture,
        joinedAt: plainUser.joinedAt.toISOString(), // Convert Date to string
      
      };
    });

    return { users: serializedUsers, isNext };
   


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

    const { clerkId, searchQuery, filter, page = 1, pageSize = 10 } = params;

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
      // return {user: null, totalEquipment: 0}
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
    const skipAmount = (page -1) * pageSize

    const totalEquipment = await EquipmentCard.countDocuments({author: userId});

    const userEquipment = await EquipmentCard.find({author: userId})
    .sort({views: -1})
    .skip(skipAmount)
    .limit(pageSize)
    .populate('tag', '_id name')
    .populate('author', '_id clerkId name picture')

    const isNext = totalEquipment > skipAmount + userEquipment.length;
    return { totalEquipment, userEquipment, isNext}
  } catch (error) {
    console.log("Error fetching user equipment", error);
    throw error;
    
  }
}


export const getUserRole = async (clerkId: string) => {
  try {
    await connectToDatabase();
    const user = await User.findOne({ clerkId }).exec();
    return  user?.role 
  } catch (error) {
    console.error('Error fetching user role:', error);
    return null;
  }
};
