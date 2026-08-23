import mongoose, { Schema } from "mongoose"

const localizedSchema = new Schema(
  {
    ar: { type: String, default: "" },
    en: { type: String, default: "" },
  },
  { _id: false },
)

const jobApplicationSchema = new Schema(
  {
    positionSlug: { type: String, required: true, trim: true, maxlength: 120, index: true },
    positionTitle: { type: localizedSchema, required: true },
    name: { type: String, required: true, trim: true, maxlength: 120 },
    email: { type: String, required: true, trim: true, maxlength: 200 },
    phone: { type: String, required: true, trim: true, maxlength: 40 },
    message: { type: String, default: "", trim: true, maxlength: 2000 },
    cvFile: { type: String, required: true, trim: true, maxlength: 300 },
    read: { type: Boolean, default: false },
  },
  { timestamps: true },
)

jobApplicationSchema.index({ createdAt: -1 })

export const JobApplication = mongoose.model("JobApplication", jobApplicationSchema)

export function serializeJobApplication(item: InstanceType<typeof JobApplication>) {
  return {
    id: item._id.toString(),
    positionSlug: item.positionSlug,
    positionTitle: item.positionTitle,
    name: item.name,
    email: item.email,
    phone: item.phone,
    message: item.message,
    cvFile: item.cvFile,
    read: item.read,
    createdAt: item.createdAt,
  }
}
