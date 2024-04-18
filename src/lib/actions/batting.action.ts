"use server";

import { BattingScorecardModel } from "@/database/batting-scorecard.modal";
import { connectToDatabase } from "../mongoose";
import { InningsModel } from "@/database/innings.model";
import { revalidatePath } from "next/cache";
import { battingScorecard } from "../definitions";

export interface CreateBattingScorecardParams {
  inningsId: string;
  playerId: string;
}

export async function createBattingScorecard(
  params: CreateBattingScorecardParams
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
    // Create a new batting scorecard
    const battingScorecard = new BattingScorecardModel({
      inningsId,
      playerId,
    });
    // Save the batting scorecard to the database
    await battingScorecard.save();

    // check player1 and player2 exist in innings
    if (!innings.strikers.player1) {
      innings.strikers.player1 = playerId;
    } else if (!innings.strikers.player2) {
      innings.strikers.player2 = playerId;
    }
    await innings.save();
    revalidatePath(`/match/${matchId}/scoring`);
  } catch (error: any) {
    return { success: false, error: error.message };
  }
  revalidatePath(`/match/${matchId}/scoring`);
}

export async function twoStrikers(inningsId: string) {
  await connectToDatabase();
  try {
    const innings = await InningsModel.findById(inningsId);
    if (!innings) {
      return { success: false, error: "Innings not found" };
    }

    const strikers1 = innings.strikers.player1;
    const strikers2 = innings.strikers.player2;

    const strikers: battingScorecard[] = [];
    // now find the player1 and player2 in batting scorecard and push them to strikers array
    const player1 = await BattingScorecardModel.findOne({
      inningsId,
      playerId: strikers1,
    }).populate("playerId");
    if (player1) {
      strikers.push(player1.toObject() as battingScorecard);
    }
    const player2 = await BattingScorecardModel.findOne({
      inningsId,
      playerId: strikers2,
    }).populate("playerId");
    if (player2) {
      strikers.push(player2.toObject() as battingScorecard);
    }
    return { success: true, strikers };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateBatsmanRun(
  inningsId: string,
  playerId: string,
  isFour: boolean,
  isSix: boolean,
  runs: number
) {
  await connectToDatabase();
  try {
    const battingScorecard = await BattingScorecardModel.findOne({
      inningsId,
      playerId,
    });
    if (!battingScorecard) {
      return { success: false, error: "Batsman not found" };
    }
    battingScorecard.runs += runs;
    battingScorecard.balls += 1;
    if (isFour) {
      battingScorecard.fours += 1;
    }
    if (isSix) {
      battingScorecard.sixes += 1;
    }

    await battingScorecard.save();
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
