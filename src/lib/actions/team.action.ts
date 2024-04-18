"use server";
import { TeamModel } from "@/database/team.model";
import { connectToDatabase } from "../mongoose";
import { team } from "../definitions";
import { revalidatePath } from "next/cache";

export interface CreateTeamParams {
  teamName: string;
  teamColor: string;
}

export async function createTeam(params: CreateTeamParams) {
  await connectToDatabase();
  const { teamName, teamColor } = params;

  try {
    // Create a new team
    const team = new TeamModel({ teamName, teamColor });

    // Save the team to the database
    await team.save();
    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getTeams() {
  await connectToDatabase();

  try {
    // Get all teams
    const teams: team[] = await TeamModel.find();
    return { success: true, teams };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
