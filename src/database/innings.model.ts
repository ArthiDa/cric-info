import { Schema, models, model, Document } from "mongoose";

export interface Innings extends Document {
  matchId: Schema.Types.ObjectId;
  battingTeamId: Schema.Types.ObjectId;
  bowlingTeamId: Schema.Types.ObjectId;
  status: "live" | "completed";
}

const inningsSchema = new Schema<Innings>({
  matchId: { type: Schema.Types.ObjectId, ref: "Match" },
  battingTeamId: { type: Schema.Types.ObjectId, ref: "Team" },
  bowlingTeamId: { type: Schema.Types.ObjectId, ref: "Team" },
  status: { type: String, enum: ["live", "completed"], default: "live" },
});

export const InningsModel =
  models.Innings || model<Innings>("Innings", inningsSchema);
