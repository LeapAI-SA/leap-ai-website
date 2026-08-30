import mongoose, { Schema } from "mongoose"

const contactMessageSchema = new Schema(
  {
    source: { type: String, enum: ["contact", "partner", "demo", "campaign"], default: "contact" },
    name: { type: String, required: true, trim: true, maxlength: 120 },
    email: { type: String, required: true, trim: true, maxlength: 200 },
    company: { type: String, default: "", trim: true, maxlength: 200 },
    address: { type: String, default: "", trim: true, maxlength: 300 },
    phone: { type: String, default: "", trim: true, maxlength: 40 },
    message: { type: String, default: "", trim: true, maxlength: 500 },
    campaignSlug: { type: String, default: "", trim: true, maxlength: 120 },
    phoneDigits: { type: String, default: "", trim: true, maxlength: 20 },
    read: { type: Boolean, default: false },
  },
  { timestamps: true },
)

contactMessageSchema.index({ createdAt: -1 })
contactMessageSchema.index({ source: 1, campaignSlug: 1, email: 1 })
contactMessageSchema.index({ source: 1, campaignSlug: 1, phoneDigits: 1 })

export const ContactMessage = mongoose.model("ContactMessage", contactMessageSchema)

export function serializeContactMessage(item: InstanceType<typeof ContactMessage>) {
  return {
    id: item._id.toString(),
    source:
      item.source === "partner"
        ? "partner"
        : item.source === "demo"
          ? "demo"
          : item.source === "campaign"
            ? "campaign"
            : "contact",
    name: item.name,
    email: item.email,
    company: item.company,
    address: item.address,
    phone: item.phone,
    message: item.message,
    campaignSlug: item.campaignSlug ?? "",
    read: item.read,
    createdAt: item.createdAt,
  }
}
