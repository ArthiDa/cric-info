export type Team = {
  id: string;
  team_name: string;
  team_color: string;
};

export type Player = {
  id: string;
  player_name: string;
  team_id: string;
};

export type Match = {
  id: string;
  teama_id: string;
  teamb_id: string;
  winner_id: string;
  overs: number;
  wickets: number;
  balls_in_over: number;
  toss: boolean;
};

export type MatchWithTeams = Match & {
  teama_name: string;
  teamb_name: string;
};

export type Innings = {
  id: string;
  match_id: string;
  batting_team_id: string;
  bowling_team_id: string;
  status: string;
  innings_number: number;
  runs: number;
  wickets: number;
  balls: number;
  extras: number;
  target: number;
  bowler_id: string;
  strikera_id: string;
  strikerb_id: string;
};

export type InningsWithMatchNTeams = Innings & {
  match_overs: number;
  match_wickets: number;
  ball_in_over: number;
  batting_team: string;
  bowling_team: string;
};

export type BattingScores = {
  id: string;
  innings_id: string;
  player_id: string;
  runs: number;
  balls: number;
  fours: number;
  sixes: number;
  is_out: boolean;
  out_type: string;
};

export type BattingScoresWithPlayer = BattingScores & {
  player_name: string;
};

export type BowlingScores = {
  id: string;
  innings_id: string;
  player_id: string;
  overs: number;
  runs: number;
  wickets: number;
  balls: number;
  maidens: number;
};

export type BowlingScoresWithPlayer = BowlingScores & {
  player_name: string;
};

export type InningsBalls = {
  id: string;
  innings_id: string;
  over_number: number;
  ball_number: number;
  runs: number;
  is_wicket: boolean;
  wicket_type: string;
  is_six: boolean;
  is_four: boolean;
  batsman_id: string;
  bowler_id: string;
  extras: number;
  created_at: Date;
};
