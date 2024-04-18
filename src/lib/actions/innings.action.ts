"use server";

import { InningsModel } from "@/database/innings.model";
import { connectToDatabase } from "../mongoose";
import { innings, inningsWithMatch } from "../definitions";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export interface CreateInningsParams {
  matchId: string;
  battingTeamId: string;
  bowlingTeamId: string;
  status: "upcoming" | "live" | "completed";
  inningsNumber: number;
}

export async function createInnings(params: CreateInningsParams) {
  await connectToDatabase();
  const { matchId, battingTeamId, bowlingTeamId, inningsNumber } = params;
  let success: boolean;
  let id: string;
  try {
    // Create a new innings
    const innings = new InningsModel({
      matchId,
      battingTeamId,
      bowlingTeamId,
      inningsNumber,
    });
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

export async function getInnings(id: string) {
  await connectToDatabase();
  try {
    const innings = await InningsModel.findById(id);
    if (!innings) {
      return { success: false, error: "Innings not found" };
    }
    return { success: true, innings: innings.toObject() as innings };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getInningsByMatchId(matchId: string) {
  await connectToDatabase();
  try {
    const innings = await InningsModel.find({ matchId })
      .populate("matchId")
      .populate("battingTeamId")
      .populate("bowlingTeamId");
    const inningsWithMatch: inningsWithMatch =
      innings[0].toObject() as inningsWithMatch;
    return { success: true, inningsWithMatch };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateInningsRuns(inningsId: string, runs: number) {
  await connectToDatabase();
  try {
    const innings = await InningsModel.findById(inningsId);
    if (!innings) {
      return { success: false, error: "Innings not found" };
    }
    innings.totalRuns += runs;
    innings.totalBalls += 1;
    await innings.save();
    revalidatePath(`/match/${innings.matchId}`);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
