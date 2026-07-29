import { Schema, model, Document, Types } from "mongoose";

export interface IFolder extends Document {
  _id: Types.ObjectId;

  name: string;

  owner: Types.ObjectId;

  parentFolder: Types.ObjectId | null;

  isDeleted: boolean;

  deletedAt: Date | null;

  createdAt: Date;
  updatedAt: Date;
}

const FolderSchema = new Schema<IFolder>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    parentFolder: {
      type: Schema.Types.ObjectId,
      ref: "Folder",
      default: null,
    },

    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },

    deletedAt: {
      type: Date,
      default: null,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Folder = model<IFolder>("Folder", FolderSchema);