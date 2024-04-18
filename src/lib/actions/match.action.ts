"use server";

import { MatchModel } from "@/database/match.model";
import { connectToDatabase } from "../mongoose";
import { match } from "../definitions";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { player } from "../definitions";
import { PlayerModel } from "@/database/player.model";

export interface CreateMatchParams {
  teamIdA: string;
  teamIdB: string;
  overs: number;
  wickets: number;
  ballInOver: number;
  toss: boolean;
}

export async function createMatch(params: CreateMatchParams) {
  await connectToDatabase();
  const { teamIdA, teamIdB, overs, wickets, ballInOver } = params;
  let id: string;
  let success: boolean;
  try {
    // Create a new match
    const match = new MatchModel({
      teamIdA,
      teamIdB,
      overs,
      wickets,
      ballInOver,
    });
    // Save the match to the database
    await match.save();
    // make the id to be a string
    id = match._id.toString();
    success = true;
  } catch (error: any) {
    id = "";
    // return the error so that it will be act as an exception error
    return { success: false, error: error.message };
  }
  revalidatePath(`/match/${id}`);
  redirect(`/match/${id}`);
}
export async function getMatch(id: string) {
  await connectToDatabase();
  try {
    // Get the match with teams and players populated
    const match = await MatchModel.findById(id)
      .populate("teamIdA")
      .populate("teamIdB");

    if (!match) {
      return { success: false, error: "Match not found" };
    }

    // Fetch the player details for each team
    const teamAPlayers = await PlayerModel.find({ team: match.teamIdA._id });
    const teamBPlayers = await PlayerModel.find({ team: match.teamIdB._id });
    return {
      success: true,
      match: {
        ...match.toObject(),
        teamAPlayers,
        teamBPlayers,
      },
    };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getMatches() {
  await connectToDatabase();
  try {
    const matches = await MatchModel.find()
      .populate("teamIdA")
      .populate("teamIdB");
    return { success: true, matches };
  } catch (error: any) {
    console.error(error);
    return { success: false, error: error.message };
  }
}

export async function updateToss(id: string, toss: boolean) {
  await connectToDatabase();
  try {
    const match = await MatchModel.findById(id);
    if (!match) {
      return { success: false, error: "Match not found" };
    }
    match.toss = toss;
    await match.save();
    return { success: true };
  } catch (error: any) {
    console.error("Toss:", error);
    return { success: false, error: error.message };
  }
}
