"use server";
import { revalidatePath } from "next/cache";
import conn from "./db";
import { redirect } from "next/navigation";

export async function createTeam(teamName: string, teamColor: string) {
  const client = await conn.connect();
  if (!client) {
    console.error("Failed to connect to database");
    return;
  }
  try {
    await client.query(
      "INSERT INTO teams (team_name, team_color) VALUES ($1, $2)",
      [teamName, teamColor]
    );
  } catch (error) {
    console.error(error);
    throw new Error("Failed to create team");
  } finally {
    client.release();
  }
  revalidatePath("/");
}

export async function createPlayer(playerName: string, teamId: string) {
  const client = await conn.connect();
  if (!client) {
    console.error("Failed to connect to database");
    return;
  }
  try {
    await client.query(
      "INSERT INTO players (player_name, team_id) VALUES ($1, $2)",
      [playerName, teamId]
    );
  } catch (error) {
    console.error(error);
    throw new Error("Failed to create player");
  } finally {
    client.release();
  }
  revalidatePath("/");
}

export async function createMatch(
  teamAId: string,
  teamBId: string,
  overs: number,
  wickets: number,
  ballsInOver: number
) {
  const client = await conn.connect();
  if (!client) {
    console.error("Failed to connect to database");
    return;
  }
  let matchId = "";
  try {
    const data = await client.query(
      "INSERT INTO matches (teamA_id, teamB_id, overs, wickets, balls_in_over) VALUES ($1, $2, $3, $4, $5) RETURNING id",
      [teamAId, teamBId, overs, wickets, ballsInOver]
    );
    matchId = data.rows[0].id;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to create match");
  } finally {
    client.release();
  }
  revalidatePath("/match");
  redirect(`/match/${matchId}`);
}

export async function createInnings(
  matchId: string,
  battingTeamId: string,
  bowlingTeamId: string,
  inningsNumber: number
) {
  const client = await conn.connect();
  if (!client) {
    console.error("Failed to connect to database");
    return;
  }
  try {
    await client.query(
      "INSERT INTO innings (match_id, batting_team_id, bowling_team_id, innings_number) VALUES ($1, $2, $3, $4)",
      [matchId, battingTeamId, bowlingTeamId, inningsNumber]
    );
  } catch (error) {
    console.error(error);
    throw new Error("Failed to create innings");
  } finally {
    client.release();
  }
  revalidatePath(`/match/${matchId}`);
  redirect(`/match/${matchId}/scoring`);
}

export async function updateToss(matchId: string) {
  const client = await conn.connect();
  if (!client) {
    console.error("Failed to connect to database");
    return;
  }
  try {
    await client.query("UPDATE matches SET toss = true WHERE id = $1", [
      matchId,
    ]);
  } catch (error) {
    console.error(error);
    throw new Error("Failed to update toss");
  } finally {
    client.release();
  }
  revalidatePath(`/match/${matchId}`);
}
