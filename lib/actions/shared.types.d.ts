import { Schema } from "mongoose";

import { IUser } from "@/database/user.model";
import { ISubunit } from "@/database/equipment.model";



export interface Subunits {
  title: string;
  brandname?:string;
  modelname?: string;
  serialNumber?: string;
  assetTag?: string
  serviceDate?: Date;
};

export interface SearchParams {
  query?: string | null;
  type?: string | null;
}

export interface RecommendedParams {
  userId: string;
  page?: number;
  pageSize?: number;
  searchQuery?: string;
}

export interface ViewEquipmentParams {
  equipmentId: string;
  userId: string | undefined;
}


export interface GetEquipmentParams {
  tag?: string | Schema.Types.ObjectId;
  page?: number;
  pageSize?: number;
  searchQuery?: string;
  filter?: string;

}

export interface CreateEquipmentParams {
  title: string;
  brandname?: string;
  modelname?: string;
  serialNumber?: string;
  assetTag?: string;
  subunits?: Subunits[]; 
  labNumber: string;
  labName?: string;
  team?: string;
  serviceDate?: Date;
  comment?: string;
  tag: string | Schema.Types.ObjectId;
  imgUrl: string | File;
  author: Schema.Types.ObjectId | IUser | string;
  path: string;
}

export interface GetEquipmentByIdParams {
   equipmentId: string;
}

export interface EquimentParams {
  equipmentId: string;
  path: string;
}

export interface EditEquipmentParams {
  equipmentId: string;
  title: string;
  imgUrl: string | File;
  brandname?: string;
  modelname?: string;
  serialNumber?: string;
  assetTag?: string;
  subunits?:  Subunits[]; 
  labNumber: string;
  labName?: string;
  team: string;
  tag: string | Schema.Types.ObjectId;
  serviceDate?: Date;
  comment?: string;
  path: string;
}

export interface GetAllTagsParams {
  page?: number;
  pageSize?: number;
  filter?: string;
  searchQuery?: string;
}

export interface GetEquipmentByTagIdParams {
  tagId: string;
  page?: number;
  pageSize?: number;
  searchQuery?: string;
}

export interface GetTopInteractedTagsParams {
  userId: string;
  limit?: number;
}

export interface CreateUserParams {
  clerkId: string;
  name: string;
  username: string;
  email: string;
  picture: string;
  role?: string;
}

export interface GetUserByIdParams {
  userId: string;
}

export interface GetAllUsersParams {
  page?: number;
  pageSize?: number;
  filter?: string;
  searchQuery?: string; // Add searchQuery parameter
}

export interface UpdateUserParams {
  clerkId: string;
  updateData: Partial<IUser>;
  path: string;
}

export interface ToggleEquipmentParams {
  userId: string;
  equipmentId: string;
  path: string;
}

export interface GetSavedEquipmentParams {
  clerkId: string;
  page?: number;
  pageSize?: number;
  filter?: string;
  searchQuery?: string;
}

export interface GetUserStatsParams {
  userId: string;
  page?: number;
  pageSize?: number;
}

export interface DeleteUserParams {
  clerkId: string;
}


export interface DeleteEquipmentParams {
  equipmentId: string;
  path: string;
}



