import mongoose, { Schema } from "mongoose"

const contactMessageSchema = new Schema(
  {
    source: { type: String, enum: ["contact", "partner"], default: "contact" },
    name: { type: String, required: true, trim: true, maxlength: 120 },
    email: { type: String, required: true, trim: true, maxlength: 200 },
    company: { type: String, default: "", trim: true, maxlength: 200 },
    address: { type: String, default: "", trim: true, maxlength: 300 },
    phone: { type: String, required: true, trim: true, maxlength: 40 },
    message: { type: String, required: true, trim: true, maxlength: 500 },
    read: { type: Boolean, default: false },
  },
  { timestamps: true },
)

contactMessageSchema.index({ createdAt: -1 })

export const ContactMessage = mongoose.model("ContactMessage", contactMessageSchema)

export function serializeContactMessage(item: InstanceType<typeof ContactMessage>) {
  return {
    id: item._id.toString(),
    source: item.source === "partner" ? "partner" : "contact",
    name: item.name,
    email: item.email,
    company: item.company,
    address: item.address,
    phone: item.phone,
    message: item.message,
    read: item.read,
    createdAt: item.createdAt,
  }
}
