import { Schema, models, model, Document } from "mongoose";

export interface Innings extends Document {
  matchId: Schema.Types.ObjectId;
  battingTeamId: Schema.Types.ObjectId;
  bowlingTeamId: Schema.Types.ObjectId;
  status: "upcoming" | "live" | "completed";
  inningsNumber: number;
  target: number;
  totalRuns: number;
  totalWickets: number;
  totalOvers: number;
  totalBalls: number;
  totalExtras: number;
  strikers: {
    player1: Schema.Types.ObjectId;
    player2: Schema.Types.ObjectId;
  };
  bowler: Schema.Types.ObjectId;
}

const inningsSchema = new Schema<Innings>({
  matchId: { type: Schema.Types.ObjectId, ref: "Match" },
  battingTeamId: { type: Schema.Types.ObjectId, ref: "Team" },
  bowlingTeamId: { type: Schema.Types.ObjectId, ref: "Team" },
  status: {
    type: String,
    enum: ["upcoming", "live", "completed"],
    default: "upcoming",
  },
  inningsNumber: { type: Number, required: true },
  target: { type: Number },
  totalRuns: { type: Number, default: 0 },
  totalWickets: { type: Number, default: 0 },
  totalOvers: { type: Number, default: 0 },
  totalBalls: { type: Number, default: 0 },
  totalExtras: { type: Number, default: 0 },
  strikers: {
    player1: { type: Schema.Types.ObjectId, ref: "Player" },
    player2: { type: Schema.Types.ObjectId, ref: "Player" },
  },
  bowler: { type: Schema.Types.ObjectId, ref: "Player" },
});

export const InningsModel =
  models.Innings || model<Innings>("Innings", inningsSchema);
