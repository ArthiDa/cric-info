"use server";

import { BowlingScorecardModel } from "@/database/bowling-scorecard.model";
import { connectToDatabase } from "../mongoose";
import { InningsModel } from "@/database/innings.model";
import { revalidatePath } from "next/cache";
import { bowlingScorecard } from "../definitions";

export interface CreateBowlingScorecardParams {
  inningsId: string;
  playerId: string;
}

export async function createBowlingScorecard(
  params: CreateBowlingScorecardParams
) {
  await connectToDatabase();
  const { inningsId, playerId } = params;
  let matchId: string;
  try {
    // update innings status to "live"
    const innings = await InningsModel.findById(inningsId);
    if (!innings) {
      return { success: false, error: "Innings not found" };
    }
    matchId = innings.matchId;
    innings.status = "live";
    // Create a new bowling scorecard
    const bowlingScorecard = new BowlingScorecardModel({
      inningsId,
      playerId,
    });
    // Save the bowling scorecard to the database
    await bowlingScorecard.save();
    // check bowler exist in innings if not set bowler
    if (!innings.bowler) {
      innings.bowler = playerId;
    } else {
      innings.bowler = playerId;
    }
    await innings.save();
    revalidatePath(`/match/${matchId}/scoring`);
  } catch (error: any) {
    return { success: false, error: error.message };
  }
  revalidatePath(`/match/${matchId}/scoring`);
}

export async function currentBowler(inningsId: string) {
  await connectToDatabase();
  try {
    const innings = await InningsModel.findById(inningsId);
    if (!innings) {
      return { success: false, error: "Innings not found" };
    }
    const bowlerId = innings.bowler;
    const bowlerDetails = await BowlingScorecardModel.findOne({
      inningsId,
      playerId: bowlerId,
    }).populate("playerId");
    const bowler = bowlerDetails.toObject() as bowlingScorecard;
    return { success: true, bowler };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateBowlerRun(
  inningsId: string,
  playerId: string,
  runs: number
) {
  await connectToDatabase();
  try {
    const bowlingScorecard = await BowlingScorecardModel.findOne({
      inningsId,
      playerId,
    });

    if (!bowlingScorecard) {
      return { success: false, error: "Bowling scorecard not found" };
    }

    bowlingScorecard.runs += runs;
    bowlingScorecard.balls += 1;
    await bowlingScorecard.save();
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
