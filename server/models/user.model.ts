// src/models/user.model.ts
import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
    email: string;
    password: string;
    role: string; // admin, user, etc.
    createdAt: Date;
}

const UserSchema = new Schema<IUser>(
    {
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        role: { type: String, default: "user" },
        createdAt: { type: Date, default: Date.now },
    },
    {
        versionKey: false,
    }
);

export const User = mongoose.model<IUser>("User", UserSchema);
