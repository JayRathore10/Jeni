import { Schema, model, Document, Types } from "mongoose";

export interface IDownloadLog extends Document {
  _id: Types.ObjectId;

  shareLinkId: Types.ObjectId;

  ipAddress: string;

  userAgent: string;

  downloadedAt: Date;
}

const DownloadLogSchema = new Schema<IDownloadLog>(
  {
    shareLinkId: {
      type: Schema.Types.ObjectId,
      ref: "ShareLink",
      required: true,
      index: true,
    },

    ipAddress: {
      type: String,
      required: true,
      trim: true,
    },

    userAgent: {
      type: String,
      required: true,
    },

    downloadedAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: false,
  }
);

export const DownloadLog = model<IDownloadLog>(
  "DownloadLog",
  DownloadLogSchema
);