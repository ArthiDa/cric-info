import { Schema, models, model, Document } from "mongoose";

export interface Teams extends Document {
  teamName: string;
  teamColor: string;
}

const teamSchema = new Schema<Teams>({
  teamName: { type: String, required: true },
  teamColor: { type: String, required: true },
});

export const TeamModel = models.Team || model<Teams>("Team", teamSchema);
