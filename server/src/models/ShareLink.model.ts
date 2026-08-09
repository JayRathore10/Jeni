import { Schema, model, Document, Types } from "mongoose";

export interface IShareLink extends Document {
  _id: Types.ObjectId;

  token: string;

  owner: Types.ObjectId;

  resourceType: "file" | "folder";

  resourceId: Types.ObjectId;

  expiresAt: Date | null;

  password: string | null;

  downloadCount: number;

  maxDownloads: number | null;

  isActive: boolean;

  createdAt: Date;
}

const ShareLinkSchema = new Schema<IShareLink>(
  {
    token: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    resourceType: {
      type: String,
      enum: ["file", "folder"],
      required: true,
    },

    resourceId: {
      type: Schema.Types.ObjectId,
      required: true,
      index: true,
    },

    expiresAt: {
      type: Date,
      default: null,
      index: true,
    },

    password: {
      type: String,
      default: null, // store hashed password
    },

    downloadCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    maxDownloads: {
      type: Number,
      default: null,
      min: 1,
    },

    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: {
      createdAt: true,
      updatedAt: false,
    },
  }
);

export const ShareLink = model<IShareLink>(
  "ShareLink",
  ShareLinkSchema
);