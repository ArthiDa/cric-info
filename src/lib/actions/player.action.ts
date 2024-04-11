"use server";

import { PlayerModel } from "@/database/player.model";
import { connectToDatabase } from "../mongoose";
import { player } from "../definitions";
import { revalidatePath } from "next/cache";

export interface CreatePlayerParams {
  playerName: string;
  teamId: string;
}

export async function createPlayer(params: CreatePlayerParams) {
  await connectToDatabase();
  const { playerName, teamId } = params;

  try {
    // Create a new player
    const player = new PlayerModel({ playerName, team: teamId });
    // Save the player to the database
    await player.save();
    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
