export type team = {
  _id: string;
  teamName: string;
  teamColor: string;
};

export type player = {
  _id: string;
  playerName: string;
  teamId: string;
};

export type match = {
  _id: string;
  teamIdA: string;
  teamIdB: string;
  overs: number;
  wickets: number;
  ballInOver: number;
  toss: boolean;
};

export type matchWithTeams = {
  _id: string;
  teamIdA: team;
  teamIdB: team;
  overs: number;
  wickets: number;
  ballInOver: number;
  toss: boolean;
};

export type innings = {
  _id: string;
  matchId: string;
  battingTeamId: string;
  bowlingTeamId: string;
  status: "live" | "completed";
};

export type inningsWithMatch = {
  _id: string;
  matchId: matchWithTeams;
  battingTeamId: team;
  bowlingTeamId: team;
  status: "upcoming" | "live" | "completed";
  inningsNumber: number;
  target: number;
  totalRuns: number;
  totalWickets: number;
  totalOvers: number;
  totalBalls: number;
  totalExtras: number;
  strikers: {
    player1: player;
    player2: player;
  };
  bowler: player;
};

export type battingScorecard = {
  _id: string;
  inningsId: string;
  playerId: player;
  runs: number;
  balls: number;
  fours: number;
  sixes: number;
  isOut: boolean;
  howOut: string;
};

export type bowlingScorecard = {
  _id: string;
  inningsId: string;
  playerId: player;
  overs: number;
  runs: number;
  wickets: number;
  maidens: number;
  extras: number;
  balls: number;
};

export type matchSummary = {
  battingTeam: battingScorecard[];
  bowlingTeam: bowlingScorecard;
};
