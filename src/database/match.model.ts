import { Schema, models, model, Document } from "mongoose";

export interface Matches extends Document {
  teamIdA: Schema.Types.ObjectId;
  teamIdB: Schema.Types.ObjectId;
  overs: number;
  wickets: number;
  ballInOver: number;
  toss: boolean;
}

const matchSchema = new Schema<Matches>({
  teamIdA: { type: Schema.Types.ObjectId, ref: "Team" },
  teamIdB: { type: Schema.Types.ObjectId, ref: "Team" },
  overs: { type: Number, required: true },
  wickets: { type: Number, required: true },
  ballInOver: { type: Number, required: true },
  toss: { type: Boolean, default: false },
});

export const MatchModel = models.Match || model<Matches>("Match", matchSchema);
