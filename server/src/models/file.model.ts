import { Schema, model, Document, Types } from "mongoose";

export interface IFile extends Document {
  _id: Types.ObjectId;

  name: string;
  originalName: string;

  mimeType: string;
  size: number;

  storagePath: string;

  owner: Types.ObjectId;

  folderId: Types.ObjectId | null;

  expiresAt: Date | null;

  isDeleted: boolean;

  createdAt: Date;
  updatedAt: Date;
}

const FileSchema = new Schema<IFile>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    originalName: {
      type: String,
      required: true,
    },

    mimeType: {
      type: String,
      required: true,
    },

    size: {
      type: Number,
      required: true,
      min: 0,
    },

    storagePath: {
      type: String,
      required: true,
    },

    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    folderId: {
      type: Schema.Types.ObjectId,
      ref: "Folder",
      default: null,
      index: true,
    },

    expiresAt: {
      type: Date,
      default: null,
      index: true,
    },

    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

export const File = model<IFile>("File", FileSchema);