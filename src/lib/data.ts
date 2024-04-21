import conn from "./db";
import { unstable_noStore as noStore } from "next/cache";
import {
  BattingScoresWithPlayer,
  BowlingScores,
  BowlingScoresWithPlayer,
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
    // fetch innings with match by match id, batting team by batting team id, bowling team by bowling team id
    const res = await client.query(
      "SELECT innings.*, matches.overs as match_overs, matches.wickets as match_wickets, matches.balls_in_over as ball_in_over, teamA.team_name as batting_team, teamB.team_name as bowling_team FROM innings INNER JOIN matches ON innings.match_id = matches.id INNER JOIN teams as teamA ON innings.batting_team_id = teamA.id INNER JOIN teams as teamB ON innings.bowling_team_id = teamB.id WHERE match_id = $1",
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

export async function fetchPlayersWithTeamId(teamId: string) {
  noStore();
  const client = await conn.connect();
  if (!client) {
    console.error("Failed to connect to database");
    return;
  }

  try {
    const res = await client.query("SELECT * FROM players WHERE team_id = $1", [
      teamId,
    ]);
    return res.rows as Player[];
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch players");
  } finally {
    client.release();
  }
}

export async function fetchCurrentStrikers(inningsId: string) {
  noStore();
  const client = await conn.connect();
  if (!client) {
    console.error("Failed to connect to database");
    return;
  }

  try {
    // check first if bowler and strikers are available in the innings table itself
    const res = await client.query("SELECT * FROM innings WHERE id = $1", [
      inningsId,
    ]);
    const innings = res.rows[0] as InningsWithMatchNTeams;
    if (innings.strikera_id && innings.strikerb_id) {
      // fetch striker from batting_scores table with player information from players table for the current innings
      const res = await client.query(
        "SELECT batting_scores.*, players.player_name FROM batting_scores INNER JOIN players ON batting_scores.player_id = players.id WHERE innings_id = $1 AND player_id IN ($2, $3)",
        [inningsId, innings.strikera_id, innings.strikerb_id]
      );
      return res.rows as BattingScoresWithPlayer[];
    }
    return [] as BattingScoresWithPlayer[];
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch current strikers");
  } finally {
    client.release();
  }
}

export async function fetchCurrentBowler(inningsId: string) {
  noStore();
  const client = await conn.connect();
  if (!client) {
    console.error("Failed to connect to database");
    return;
  }

  try {
    // check first if bowler and strikers are available in the innings table itself
    const res = await client.query("SELECT * FROM innings WHERE id = $1", [
      inningsId,
    ]);
    const innings = res.rows[0] as InningsWithMatchNTeams;
    if (innings.bowler_id) {
      // fetch bowler from bowling_scores table with player information from players table for the current innings
      const res = await client.query(
        "SELECT bowling_scores.*, players.player_name FROM bowling_scores INNER JOIN players ON bowling_scores.player_id = players.id WHERE innings_id = $1 AND player_id = $2",
        [inningsId, innings.bowler_id]
      );
      return res.rows[0] as BowlingScoresWithPlayer;
    }
    return null;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch current bowler");
  } finally {
    client.release();
  }
}
