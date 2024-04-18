import { Schema, models, model, Document } from "mongoose";

export interface BattingScorecard extends Document {
  inningsId: Schema.Types.ObjectId;
  playerId: Schema.Types.ObjectId;
  runs: number;
  balls: number;
  fours: number;
  sixes: number;
  isOut: boolean;
  howOut: string;
}

const battingScorecardSchema = new Schema<BattingScorecard>({
  inningsId: { type: Schema.Types.ObjectId, ref: "Innings" },
  playerId: { type: Schema.Types.ObjectId, ref: "Player" },
  runs: { type: Number, default: 0 },
  balls: { type: Number, default: 0 },
  fours: { type: Number, default: 0 },
  sixes: { type: Number, default: 0 },
  isOut: { type: Boolean, default: false },
  howOut: { type: String, default: "" },
});

export const BattingScorecardModel =
  models.BattingScorecard ||
  model<BattingScorecard>("BattingScorecard", battingScorecardSchema);
