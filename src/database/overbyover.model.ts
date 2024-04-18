import { Schema, models, model, Document } from "mongoose";

export interface OverByOver extends Document {
  inningsId: Schema.Types.ObjectId;
  overNumber: number;
  overDetails: [
    {
      ballNumber: number;
      batsmanId: Schema.Types.ObjectId;
      bowlerId: Schema.Types.ObjectId;
      runs: number;
      wicket: boolean;
      extra: number;
    }
  ];
}

const overByOverSchema = new Schema<OverByOver>({
  inningsId: { type: Schema.Types.ObjectId, ref: "Innings" },
  overNumber: { type: Number, required: true },
  overDetails: [
    {
      ballNumber: { type: Number, required: true },
      batsmanId: { type: Schema.Types.ObjectId, ref: "Player" },
      bowlerId: { type: Schema.Types.ObjectId, ref: "Player" },
      runs: { type: Number, required: true },
      wicket: { type: Boolean, required: true },
      extra: { type: Number, required: true },
    },
  ],
});

export const OverByOverModel =
  models.OverByOver || model<OverByOver>("OverByOver", overByOverSchema);
