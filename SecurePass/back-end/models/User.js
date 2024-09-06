// models/User.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: { type: String, required: true},
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    resetToken: { type: String, default: null },
    resetPasswordExpires: { type: Date, default: null },
});

export const User = mongoose.model('User', userSchema);
