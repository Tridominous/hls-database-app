
import { z } from 'zod';

// Define a custom schema for file uploads
const FileSchema = z.instanceof(File);

// Define a custom schema for subunits
const SubunitSchema = z.object({
    title: z.string().min(4).max(100),
    brandname: z.string().min(2).max(100).optional(),
    modelname: z.string().min(2).max(100).optional(),
    serialNumber: z.string().min(4).max(25).optional(),
    assetTag: z.string().min(2).max(25).optional(),
    serviceDate: z.date().optional(),
});

export const EquipmentSchema = z.object({
    title: z.string().min(4).max(100),
    brandname: z.string().min(2).max(100).optional(),
    modelname: z.string().min(2).max(100).optional(),
    serialNumber: z.string().min(4).max(25).optional(),
    assetTag: z.string().min(2).max(25).optional(),
    subunits: z.array(SubunitSchema).optional(),
    labNumber: z.string().min(2).max(100),
    labName: z.string().min(2).max(100).optional(),
    team: z.string().min(2).max(25),
    serviceDate: z.date().optional(),
    tag: z.string().min(2).max(100),
    comment: z.string().min(3).max(150).optional(),
    imgUrl: z.union([z.string(), FileSchema]),
    
  })