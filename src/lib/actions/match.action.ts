"use server";

import { MatchModel } from "@/database/match.model";
import { connectToDatabase } from "../mongoose";
import { match } from "../definitions";
import { revalidatePath } from "next/cache";

export interface CreateMatchParams {
  teamIdA: string;
  teamIdB: string;
  overs: number;
  wickets: number;
}

export async function createMatch(params: CreateMatchParams) {
  await connectToDatabase();
  const { teamIdA, teamIdB, overs, wickets } = params;

  try {
    // Create a new match
    const match = new MatchModel({ teamIdA, teamIdB, overs, wickets });

    // Save the match to the database
    await match.save();
    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
