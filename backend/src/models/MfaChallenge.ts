import mongoose, { Schema } from "mongoose"

const mfaChallengeSchema = new Schema(
  {
    challengeId: { type: String, required: true, unique: true, index: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    codeHash: { type: String, required: true },
    attempts: { type: Number, required: true, default: 0 },
    sentAt: { type: Date, required: true },
    expiresAt: { type: Date, required: true, index: { expireAfterSeconds: 0 } },
    consumedAt: { type: Date, default: null },
  },
  { timestamps: true },
)

export const MfaChallenge = mongoose.model("MfaChallenge", mfaChallengeSchema)
