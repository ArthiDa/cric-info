const { Pool } = require("pg");

// const bcrypt = require('bcrypt');
const { teams, players } = require("../src/lib/placeholder-data.js");

async function seedTeams(client) {
  try {
    await client.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);
    // Create the "teams" table if it doesn't exist
    const createTable = await client.query(`
      CREATE TABLE IF NOT EXISTS teams (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        team_name VARCHAR(255) NOT NULL,
        team_color VARCHAR(255) NOT NULL
      );
    `);

    const insertedTeams = await Promise.all(
      teams.map((team) => {
        return client.query({
          text: `INSERT INTO teams (id, team_name, team_color)
          VALUES ($1, $2, $3)
          ON CONFLICT (id) DO NOTHING;`,
          values: [team.id, team.teamName, team.teamColor],
        });
      })
    );
    console.log(`Seeded ${insertedTeams.length} teams`);
  } catch (error) {
    console.error("Error seeding teams:", error);
    throw error;
  }
}

async function seedPlayers(client) {
  try {
    const createTable = await client.query(`
    CREATE TABLE IF NOT EXISTS players (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      player_name VARCHAR(255) NOT NULL,
      team_id UUID NOT NULL,
      FOREIGN KEY (team_id) REFERENCES teams (id)
    );
  `);
    console.log(`Created "players" table`);

    const insertedPlayers = await Promise.all(
      players.map((player) => {
        return client.query({
          text: `INSERT INTO players (id, player_name, team_id)
          VALUES ($1, $2, $3)
          ON CONFLICT (id) DO NOTHING;`,
          values: [player.id, player.playerName, player.teamId],
        });
      })
    );

    console.log(`Seeded ${insertedPlayers.length} players`);
  } catch (error) {
    console.error("Error seeding players:", error);
    throw error;
  }
}

async function seedMatches(client) {
  try {
    const createTable = await client.query(`
    CREATE TABLE IF NOT EXISTS matches (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      teamA_id UUID NOT NULL,
      teamB_id UUID NOT NULL,
      winner_id UUID,
      overs INT NOT NULL,
      wickets INT NOT NULL,
      balls_in_over INT NOT NULL,
      FOREIGN KEY (teamA_id) REFERENCES teams (id),
      FOREIGN KEY (teamB_id) REFERENCES teams (id),
      FOREIGN KEY (winner_id) REFERENCES teams (id)
    );
  `);
    console.log(`Created "matches" table`);
  } catch (error) {
    console.error("Error seeding matchs:", error);
    throw error;
  }
}

async function seedInnings(client) {
  try {
    const createTable = await client.query(`
    CREATE TABLE IF NOT EXISTS innings (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      match_id UUID NOT NULL,
      batting_team_id UUID NOT NULL,
      bowling_team_id UUID NOT NULL,
      status VARCHAR(255) DEFAULT 'Upcoming',
      innings_number INT NOT NULL,
      runs INT DEFAULT 0,
      wickets INT DEFAULT 0,
      balls INT DEFAULT 0,
      extras INT DEFAULT 0,
      target INT,
      bowler_id UUID,
      strikerA_id UUID,
      strikerB_id UUID,
      FOREIGN KEY (match_id) REFERENCES matches (id),
      FOREIGN KEY (batting_team_id) REFERENCES teams (id),
      FOREIGN KEY (bowling_team_id) REFERENCES teams (id),
      FOREIGN KEY (bowler_id) REFERENCES players (id),
      FOREIGN KEY (strikerA_id) REFERENCES players (id),
      FOREIGN KEY (strikerB_id) REFERENCES players (id)
    );
  `);

    console.log(`Created "innings" table`);
  } catch (error) {
    console.error("Error seeding innings:", error);
    throw error;
  }
}

async function seedBattingScores(client) {
  try {
    const createTable = await client.query(`
    CREATE TABLE IF NOT EXISTS batting_scores (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      player_id UUID NOT NULL,
      innings_id UUID NOT NULL,
      runs INT DEFAULT 0,
      balls INT DEFAULT 0,
      fours INT DEFAULT 0,
      sixes INT DEFAULT 0,
      is_out BOOLEAN DEFAULT FALSE,
      out_type VARCHAR(255),
      FOREIGN KEY (player_id) REFERENCES players (id),
      FOREIGN KEY (innings_id) REFERENCES innings (id)
    );
  `);

    console.log(`Created 'battingScores' table`);
  } catch (error) {
    console.error("Error seeding batting scores:", error);
    throw error;
  }
}

async function seedBowlingScores(client) {
  try {
    const createTable = await client.query(`
    CREATE TABLE IF NOT EXISTS bowling_scores (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      player_id UUID NOT NULL,
      innings_id UUID NOT NULL,
      runs INT DEFAULT 0,
      balls INT DEFAULT 0,
      wickets INT DEFAULT 0,
      overs INT DEFAULT 0,
      maidens INT DEFAULT 0,
      FOREIGN KEY (player_id) REFERENCES players (id),
      FOREIGN KEY (innings_id) REFERENCES innings (id)
    );
  `);

    console.log(`Created 'bowlingScores' table`);
  } catch (error) {
    console.error("Error seeding bowling scores:", error);
    throw error;
  }
}

async function inningsBall(client) {
  try {
    const createTable = await client.query(`
    CREATE TABLE IF NOT EXISTS innings_balls (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      innings_id UUID NOT NULL,
      over_number INT NOT NULL,
      ball_number INT NOT NULL,
      runs INT DEFAULT 0,
      is_wicket BOOLEAN DEFAULT FALSE,
      wicket_type VARCHAR(255),
      is_six BOOLEAN DEFAULT FALSE,
      is_four BOOLEAN DEFAULT FALSE,
      batsman_id UUID NOT NULL,
      bowler_id UUID NOT NULL,
      extras INT DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (innings_id) REFERENCES innings (id),
      FOREIGN KEY (batsman_id) REFERENCES players (id),
      FOREIGN KEY (bowler_id) REFERENCES players (id)
    );
  `);

    console.log(`Created 'inningsBall' table`);
  } catch (error) {
    console.error("Error seeding innings ball:", error);
    throw error;
  }
}

async function main() {
  const conn = new Pool({
    connectionString: process.env.POSTGRES_URL_RENDER,
    ssl: process.env.POSTGRES_URL_RENDER ? true : false,
  });

  const client = await conn.connect();
  // await seedTeams(client);
  // await seedPlayers(client);
  // await seedMatches(client);
  // await seedInnings(client);
  // await seedBattingScores(client);
  // await seedBowlingScores(client);
  // await inningsBall(client);

  await client.release();
  await conn.end();

  console.log("Seeding complete");
}

main().catch((err) => {
  console.error(
    "An error occurred while attempting to seed the database:",
    err
  );
});
