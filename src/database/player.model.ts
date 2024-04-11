import { Schema, models, model, Document } from "mongoose";

export interface Players extends Document {
  playerName: string;
  team: Schema.Types.ObjectId;
}

const playerSchema = new Schema<Players>({
  playerName: { type: String, required: true },
  team: { type: Schema.Types.ObjectId, ref: "Team" },
});

export const PlayerModel =
  models.Player || model<Players>("Player", playerSchema);
