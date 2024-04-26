"use server";
import { revalidatePath } from "next/cache";
import conn from "./db";
import { redirect } from "next/navigation";
import { InningsWithMatchNTeams } from "./definitions";

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

export async function updateStrikers(
  strikera_id: string,
  strikerb_id: string,
  innings_id: string,
  matchId: string
) {
  const client = await conn.connect();
  if (!client) {
    console.error("Failed to connect to database");
    return;
  }
  try {
    await client.query(
      "UPDATE innings SET strikera_id = $1, strikerb_id = $2 where innings.id = $3",
      [strikera_id, strikerb_id, innings_id]
    );
    // check strikera_id exist in batting_scores table if not then create a new record
    const strikerA = await client.query(
      "SELECT * FROM batting_scores WHERE player_id = $1 AND innings_id = $2",
      [strikera_id, innings_id]
    );
    if (strikerA.rowCount === 0) {
      await client.query(
        "INSERT INTO batting_scores (player_id, innings_id) VALUES ($1, $2)",
        [strikera_id, innings_id]
      );
    }
    // check strikerb_id exist in batting_scores table if not then create a new record
    const strikerB = await client.query(
      "SELECT * FROM batting_scores WHERE player_id = $1 AND innings_id = $2",
      [strikerb_id, innings_id]
    );
    if (strikerB.rowCount === 0) {
      await client.query(
        "INSERT INTO batting_scores (player_id, innings_id) VALUES ($1, $2)",
        [strikerb_id, innings_id]
      );
    }
  } catch (error) {
    console.error(error);
    throw new Error("Failed to update strikers");
  } finally {
    client.release();
  }
  revalidatePath(`/match/${matchId}/scoring`);
}

export async function updateBowler(
  bowler_id: string,
  innings_id: string,
  match_id: string
) {
  const client = await conn.connect();
  if (!client) {
    console.error("Failed to connect to database");
    return;
  }
  try {
    await client.query(
      "UPDATE innings SET bowler_id = $1 where innings.id = $2",
      [bowler_id, innings_id]
    );
    // check bowler_id exist in bowling_scores table if not then create a new record
    const bowler = await client.query(
      "SELECT * FROM bowling_scores WHERE player_id = $1 AND innings_id = $2",
      [bowler_id, innings_id]
    );
    if (bowler.rowCount === 0) {
      await client.query(
        "INSERT INTO bowling_scores (player_id, innings_id) VALUES ($1, $2)",
        [bowler_id, innings_id]
      );
    }
  } catch (error) {
    console.error(error);
    throw new Error("Failed to update bowler");
  } finally {
    client.release();
  }
  revalidatePath(`/match/${match_id}/scoring`);
}

export async function updateBasicScore(
  score: number,
  is_four: boolean,
  is_six: boolean,
  batsman_id: string,
  bowler_id: string,
  inningsDetails: InningsWithMatchNTeams,
  innings_first_ball: boolean
) {
  const client = await conn.connect();
  if (!client) {
    console.error("Failed to connect to database");
    return;
  }
  try {
    if (innings_first_ball) {
      // update innings status to live
      await client.query("UPDATE innings SET status = 'Live' WHERE id = $1", [
        inningsDetails.id,
      ]);
    }
    // 1. update innings runs and balls
    await client.query(
      "UPDATE innings SET runs = runs + $1, balls = balls + 1 WHERE id = $2",
      [score, inningsDetails.id]
    );
    // 2. update batsman runs, balls, fours, sixes
    await client.query(
      "UPDATE batting_scores SET runs = runs + $1, balls = balls + 1, fours = fours + $2, sixes = sixes + $3, bowler_id = $4 WHERE player_id = $5 AND innings_id = $6",
      [
        score,
        is_four ? 1 : 0,
        is_six ? 1 : 0,
        bowler_id,
        batsman_id,
        inningsDetails.id,
      ]
    );
    // 3. update bowler runs, balls
    await client.query(
      "UPDATE bowling_scores SET runs = runs + $1, balls = balls + 1 WHERE player_id = $2 AND innings_id = $3",
      [score, bowler_id, inningsDetails.id]
    );

    // 4. create a new record in innings_balls table
    const overNumber = Math.floor(
      inningsDetails.balls / inningsDetails.ball_in_over
    );
    await client.query(
      "INSERT INTO innings_balls (over_number, ball_number, runs, is_six, is_four, batsman_id, bowler_id, innings_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)",
      [
        overNumber,
        inningsDetails.balls,
        score,
        is_six,
        is_four,
        batsman_id,
        bowler_id,
        inningsDetails.id,
      ]
    );
  } catch (error) {
    console.error(error);
    throw new Error("Failed to update basic score");
  } finally {
    client.release();
  }
  revalidatePath(`/match/${inningsDetails.match_id}/scoring`);
}

export async function updateBasicOut(
  inningsDetails: InningsWithMatchNTeams,
  strikerId: string,
  bowlerId: string,
  outType: string
) {
  const client = await conn.connect();
  if (!client) {
    console.error("Failed to connect to database");
    return;
  }
  try {
    if (inningsDetails.strikera_id === strikerId) {
      // update innings table to increase wickets and ball by 1, set strikera_id to null
      await client.query(
        "UPDATE innings SET wickets = wickets + 1, balls = balls + 1, strikera_id = NULL WHERE id = $1",
        [inningsDetails.id]
      );
    } else {
      // update innings table to increase wickets and ball by 1 and set strikerb_id to null
      await client.query(
        "UPDATE innings SET wickets = wickets + 1, balls = balls + 1, strikerb_id = NULL WHERE id = $1",
        [inningsDetails.id]
      );
    }

    // update batting_scores table to set is_out to true, out_type and bowler_id
    await client.query(
      "UPDATE batting_scores SET is_out = true, balls = balls + 1, out_type = $1, bowler_id = $2 WHERE player_id = $3 AND innings_id = $4",
      [outType, bowlerId, strikerId, inningsDetails.id]
    );

    // update bowling_scores table to increase wickets by 1, balls by 1
    await client.query(
      "UPDATE bowling_scores SET wickets = wickets + 1, balls = balls + 1 WHERE player_id = $1 AND innings_id = $2",
      [bowlerId, inningsDetails.id]
    );

    // insert new record to innings_balls table with is_wicket to true, wicket_type, bowler_id, ball_number, batsman_id, out_batsman_id, innings_id
    const overNumber = Math.floor(
      inningsDetails.balls / inningsDetails.ball_in_over
    );
    await client.query(
      "INSERT INTO innings_balls (over_number, ball_number, is_wicket, wicket_type, bowler_id, batsman_id, innings_id, out_batsman_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)",
      [
        overNumber,
        inningsDetails.balls,
        true,
        outType,
        bowlerId,
        strikerId,
        inningsDetails.id,
        strikerId,
      ]
    );
  } catch (error) {
    console.error(error);
    throw new Error("Failed to update basic out");
  } finally {
    client.release();
  }
  revalidatePath(`/match/${inningsDetails.match_id}/scoring`);
}

export async function updateRunOut(
  out_batsman_id: string,
  inningsDetails: InningsWithMatchNTeams,
  strikerId: string,
  bowlerId: string,
  totalRuns: number,
  extras: number,
  batsmanRuns: number,
  ballCount: boolean
) {
  const client = await conn.connect();
  if (!client) {
    console.error("Failed to connect to database");
    return;
  }
  try {
    if (inningsDetails.strikera_id === out_batsman_id) {
      // update innings table to increase runs, balls if ballCount is true, wickets by 1,  set strikera_id to null
      await client.query(
        "UPDATE innings SET runs = runs + $1, balls = balls + $2, wickets = wickets + 1, extras = extras + $3,  strikera_id = NULL WHERE id = $4",
        [totalRuns, ballCount ? 1 : 0, extras, inningsDetails.id]
      );
    }
    if (inningsDetails.strikerb_id === out_batsman_id) {
      // update innings table to increase runs, balls if ballCount is true, wickets by 1,  set strikerb_id to null
      await client.query(
        "UPDATE innings SET runs = runs + $1, balls = balls + $2, wickets = wickets + 1, extras = extras + $3,  strikerb_id = NULL WHERE id = $4",
        [totalRuns, ballCount ? 1 : 0, extras, inningsDetails.id]
      );
    }

    const outType = "Run Out";
    // update batting_scores table to set is_out to true, out_type and bowler_id
    if (strikerId === out_batsman_id) {
      await client.query(
        "UPDATE batting_scores SET is_out = true, balls = balls + $1, out_type = $2, runs = runs + $3  WHERE player_id = $4 AND innings_id = $5",
        [
          ballCount ? 1 : 0,
          outType,
          batsmanRuns,
          out_batsman_id,
          inningsDetails.id,
        ]
      );
    } else {
      await client.query(
        "UPDATE batting_scores SET is_out = true, out_type = $1, WHERE player_id = $2 AND innings_id = $3",
        [outType, out_batsman_id, inningsDetails.id]
      );
      await client.query(
        "UPDATE batting_scores SET runs = runs + $1, balls = balls + $2 WHERE player_id = $3 AND innings_id = $4",
        [batsmanRuns, ballCount ? 1 : 0, strikerId, inningsDetails.id]
      );
    }

    // update bowling_scores table to increase wickets by 1, balls by 1
    await client.query(
      "UPDATE bowling_scores SET balls = balls + $1, runs = runs + $2 WHERE player_id = $3 AND innings_id = $4",
      [ballCount ? 1 : 0, totalRuns, bowlerId, inningsDetails.id]
    );

    // insert new record to innings_balls table with is_wicket to true, wicket_type, bowler_id, ball_number, batsman_id, out_batsman_id, innings
    const overNumber = ballCount
      ? Math.floor((inningsDetails.balls + 1) / inningsDetails.ball_in_over)
      : Math.floor(inningsDetails.balls / inningsDetails.ball_in_over);
    await client.query(
      "INSERT INTO innings_balls (over_number, ball_number, is_wicket, wicket_type, bowler_id, batsman_id, innings_id, out_batsman_id, runs, extras) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)",
      [
        overNumber,
        inningsDetails.balls + 1,
        true,
        outType,
        bowlerId,
        strikerId,
        inningsDetails.id,
        out_batsman_id,
        totalRuns,
        extras,
      ]
    );
  } catch (error) {
    console.error(error);
    throw new Error("Failed to update run out");
  } finally {
    client.release();
  }
  revalidatePath(`/match/${inningsDetails.match_id}/scoring`);
}

export async function updateOver(
  innings_id: string,
  bowlerId: string,
  match_id: string
) {
  const client = await conn.connect();
  if (!client) {
    console.error("Failed to connect to database");
    return;
  }
  try {
    // set bowler_id null in innings table
    await client.query("UPDATE innings SET bowler_id = NULL WHERE id = $1", [
      innings_id,
    ]);
    // update overs by 1 in bowling_scores table
    await client.query(
      "UPDATE bowling_scores SET overs = overs + 1 WHERE player_id = $1 AND innings_id = $2",
      [bowlerId, innings_id]
    );
  } catch (error) {
    console.error(error);
    throw new Error("Failed to update over");
  } finally {
    client.release();
  }
  revalidatePath(`/match/${match_id}/scoring`);
}

export async function updateExtra(
  inningsDetails: InningsWithMatchNTeams,
  bowlerId: string,
  extras: number
) {
  const client = await conn.connect();
  if (!client) {
    console.error("Failed to connect to database");
    return;
  }
  try {
    // update innings table to increase extras by 1
    await client.query(
      "UPDATE innings SET extras = extras + $1, runs = runs + $2 WHERE id = $3",
      [extras, extras, inningsDetails.id]
    );
    // update bowling_scores table to increase extras by 1
    await client.query(
      "UPDATE bowling_scores SET runs = runs + $1 WHERE player_id = $2 AND innings_id = $3",
      [extras, bowlerId, inningsDetails.id]
    );
    // create a new ball record in innings_balls table
    await client.query(
      "INSERT INTO innings_balls (ball_number, runs, extras, bowler_id, innings_id) VALUES ($1, $2, $3, $4, $5)",
      [inningsDetails.balls, extras, extras, bowlerId, inningsDetails.id]
    );
  } catch (error) {
    console.error(error);
    throw new Error("Failed to update extra");
  } finally {
    client.release();
  }
  revalidatePath(`/match/${inningsDetails.match_id}/scoring`);
}

export async function updateMoreScore(
  inningDetails: InningsWithMatchNTeams,
  strikerId: string,
  bowlerId: string,
  totalRuns: number,
  extras: number,
  batsmanRuns: number,
  isLegalDelivery: boolean,
  isSix: boolean,
  isFour: boolean
) {
  const client = await conn.connect();
  if (!client) {
    console.error("Failed to connect to database");
    return;
  }
  try {
    // update innings table to increase runs, balls if isLegalDelivery is true, wickets by 1,  set strikera_id to null
    await client.query(
      "UPDATE innings SET runs = runs + $1, balls = balls + $2, extras = extras + $3 WHERE id = $4",
      [totalRuns, isLegalDelivery ? 1 : 0, extras, inningDetails.id]
    );

    // update batting_scores table to set is_out to true, out_type and bowler_id
    await client.query(
      "UPDATE batting_scores SET runs = runs + $1, balls = balls + 1, sixes = sixes + $2, fours = fours + $3 WHERE player_id = $4 AND innings_id = $5",
      [batsmanRuns, isSix ? 1 : 0, isFour ? 1 : 0, strikerId, inningDetails.id]
    );

    // update bowling_scores table to increase wickets by 1, balls by 1
    await client.query(
      "UPDATE bowling_scores SET runs = runs + $1, balls = balls + $2 WHERE player_id = $3 AND innings_id = $4",
      [totalRuns, isLegalDelivery ? 1 : 0, bowlerId, inningDetails.id]
    );

    // insert new record to innings_balls table with is_wicket to true, wicket_type, bowler_id, ball_number, batsman_id, out_batsman_id, innings
    const overNumber = isLegalDelivery
      ? Math.floor((inningDetails.balls + 1) / inningDetails.ball_in_over)
      : Math.floor(inningDetails.balls / inningDetails.ball_in_over);
    await client.query(
      "INSERT INTO innings_balls (over_number, ball_number, bowler_id, batsman_id, innings_id, runs, extras, is_six, is_four) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)",
      [
        overNumber,
        isLegalDelivery ? inningDetails.balls + 1 : inningDetails.balls,
        bowlerId,
        strikerId,
        inningDetails.id,
        totalRuns,
        extras,
        isSix,
        isFour,
      ]
    );
  } catch (error) {
    console.error(error);
    throw new Error("Failed to update more score");
  } finally {
    client.release();
  }
  revalidatePath(`/match/${inningDetails.match_id}/scoring`);
}
