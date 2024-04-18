import { Schema, models, model, Document } from "mongoose";

export interface BowlingScorecard extends Document {
  inningsId: Schema.Types.ObjectId;
  playerId: Schema.Types.ObjectId;
  overs: number;
  runs: number;
  wickets: number;
  maidens: number;
  balls: number;
}

const bowlingScorecardSchema = new Schema<BowlingScorecard>({
  inningsId: { type: Schema.Types.ObjectId, ref: "Innings" },
  playerId: { type: Schema.Types.ObjectId, ref: "Player" },
  overs: { type: Number, default: 0 },
  runs: { type: Number, default: 0 },
  wickets: { type: Number, default: 0 },
  maidens: { type: Number, default: 0 },
  balls: { type: Number, default: 0 },
});

export const BowlingScorecardModel =
  models.BowlingScorecard ||
  model<BowlingScorecard>("BowlingScorecard", bowlingScorecardSchema);
