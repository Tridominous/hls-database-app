"use server"

import { connectToDatabase } from "../mongoose";
import { SearchParams } from "./shared.types";
import User from "@/database/user.model";
import Tag from "@/database/tag.model";
import EquipmentCard from "@/database/equipment.model";

const SearchableTypes = ["equipment", "user", "tag"];

export async function globalSearch(params: SearchParams) {
  try {
    await connectToDatabase();

    const { query, type } = params;
    const regexQuery = { $regex: query, $options: "i" };

    let results = [];

    const modelsAndTypes = [
      { model: EquipmentCard, searchField: 'title', type: 'equipment'},
      { model: User, searchField: 'name', type: 'user'},
      { model: Tag, searchField: 'name', type: 'tag'},
    ];

    const typeLower = type?.toLowerCase();

    if(!typeLower || !SearchableTypes.includes(typeLower)) {
      // SEARCH ACROSS EVERYTHING
      for (const { model, searchField, type } of modelsAndTypes) {
        const queryResults = await model
          .find({ [searchField]: regexQuery })
          .limit(2);

        if (queryResults.length > 0) {
          results.push(
            ...queryResults.map((item) => ({
              title: type === 'equipment' 
                ? item[searchField] // Use the actual title instead of "Equipment containing..."
                : item[searchField],
              type,
              id: type === 'user'
                ? item.clerkId
                : item._id // Simplified ID logic
            }))
          );
        }
      }
    } else {
      // SEARCH IN THE SPECIFIED MODEL TYPE
      const modelInfo = modelsAndTypes.find((item) => item.type === typeLower);

      if (!modelInfo) {
        throw new Error("Invalid search type");
      }

      const queryResults = await modelInfo.model
        .find({ [modelInfo.searchField]: regexQuery })
        .limit(8);

      results = queryResults.map((item) => ({
        title: item[modelInfo.searchField],
        type: typeLower,
        id: typeLower === 'user' ? item.clerkId : item._id
      }));
    }

    // If no results found, return an empty array instead of null
    return JSON.stringify(results.length > 0 ? results : []);
  } catch (error) {
    console.log(`Error fetching global results, ${error}`);
    throw error;
  }
}