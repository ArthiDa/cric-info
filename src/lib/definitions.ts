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
};
