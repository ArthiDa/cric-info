import conn from "./db";
import { unstable_noStore as noStore } from "next/cache";
import {
  InningsWithMatchNTeams,
  Match,
  MatchWithTeams,
  Player,
  Team,
} from "./definitions";

export async function fetchTeams() {
  noStore();
  const client = await conn.connect();
  if (!client) {
    console.error("Failed to connect to database");
    return;
  }
  try {
    const res = await client.query("SELECT * FROM teams");

    return res.rows as Team[];
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch teams");
  } finally {
    client.release();
  }
}

export async function fetchPlayers() {
  noStore();
  const client = await conn.connect();
  if (!client) {
    console.error("Failed to connect to database");
    return;
  }

  try {
    const res = await client.query("SELECT * FROM players");
    return res.rows as Player[];
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch players");
  } finally {
    client.release();
  }
}

export async function fetchMatches() {
  noStore();
  const client = await conn.connect();
  if (!client) {
    console.error("Failed to connect to database");
    return;
  }

  try {
    // fetch matches with team information
    const res = await client.query(
      "SELECT matches.*, teamA.team_name as teamA_name, teamB.team_name as teamB_name FROM matches INNER JOIN teams as teamA ON matches.teamA_id = teamA.id INNER JOIN teams as teamB ON matches.teamB_id = teamB.id"
    );
    return res.rows as MatchWithTeams[];
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch matches");
  } finally {
    client.release();
  }
}

export async function fetchMatch(matchId: string) {
  noStore();
  const client = await conn.connect();
  if (!client) {
    console.error("Failed to connect to database");
    return;
  }

  try {
    // fetch match with team information
    const res = await client.query(
      "SELECT matches.*, teamA.team_name as teamA_name, teamB.team_name as teamB_name FROM matches INNER JOIN teams as teamA ON matches.teamA_id = teamA.id INNER JOIN teams as teamB ON matches.teamB_id = teamB.id WHERE matches.id = $1",
      [matchId]
    );
    return res.rows[0] as MatchWithTeams;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch match");
  } finally {
    client.release();
  }
}

export async function fetchInningsByMatchId(matchId: string) {
  noStore();
  const client = await conn.connect();
  if (!client) {
    console.error("Failed to connect to database");
    return;
  }

  try {
    // fetch innings with match information, batting team information, and bowling team information
    const res = await client.query(
      "SELECT innings.*, matches.overs as match_overs, matches.wickets as match_wickets, matches.balls_in_over as ball_in_over, teamA.team_name as batting_team, teamB.team_name as bowling_team FROM innings INNER JOIN matches ON innings.match_id = matches.id INNER JOIN teams as teamA ON matches.teamA_id = teamA.id INNER JOIN teams as teamB ON matches.teamB_id = teamB.id WHERE innings.match_id = $1",
      [matchId]
    );

    const inningsDetails = res.rows[0] as InningsWithMatchNTeams;
    return inningsDetails;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch innings");
  } finally {
    client.release();
  }
}
