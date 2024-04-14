"use server";

import { InningsModel } from "@/database/innings.model";
import { connectToDatabase } from "../mongoose";
import { innings } from "../definitions";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export interface CreateInningsParams {
  matchId: string;
  battingTeamId: string;
  bowlingTeamId: string;
  status: "live" | "completed";
}

export async function createInnings(params: CreateInningsParams) {
  await connectToDatabase();
  const { matchId, battingTeamId, bowlingTeamId } = params;
  let success: boolean;
  let id: string;
  try {
    // Create a new innings
    const innings = new InningsModel({ matchId, battingTeamId, bowlingTeamId });
    // Save the innings to the database
    await innings.save();

    success = true;
  } catch (error: any) {
    console.error(error);
    success = false;
  }
  if (!success) {
    return { success };
  }
  revalidatePath(`/match/${matchId}`);
  redirect(`/match/${matchId}/scoring`);
}
