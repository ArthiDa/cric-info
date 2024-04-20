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

export type MatchWithTeams = Match & {
  teama_name: string;
  teamb_name: string;
};

export type InningsWithMatchNTeams = Innings & {
  match_overs: number;
  match_wickets: number;
  ball_in_over: number;
  batting_team: string;
  bowling_team: string;
};

// [
//   {
//     id: 'f9ead714-7d79-4d2f-b4a5-02cfe9c036b1',
//     match_id: 'a24f2715-9f10-40f8-8047-46e15a6b30b5',
//     batting_team_id: '410544b2-4001-4271-9855-fec4b6a6442a',
//     bowling_team_id: '5f2d94df-e5a8-4f58-8d76-83ff876cdacb',
//     status: 'Upcoming',
//     innings_number: 1,
//     runs: 0,
//     wickets: 0,
//     balls: 0,
//     extras: 0,
//     target: null,
//     bowler_id: null,
//     strikera_id: null,
//     strikerb_id: null,
//     match_overs: 1,
//     match_wickets: 1,
//     ball_in_over: 6,
//     batting_team: 'Bangladesh',
//     bowling_team: 'Australia'
//   }
// ]
