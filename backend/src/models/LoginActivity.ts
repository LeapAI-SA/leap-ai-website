import mongoose, { Schema } from "mongoose"

const loginActivitySchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    ip: { type: String, required: true },
    location: { type: String, required: true },
    device: { type: String, required: true },
  },
  { timestamps: true },
)

loginActivitySchema.index({ createdAt: -1 })

export const LoginActivity = mongoose.model("LoginActivity", loginActivitySchema)