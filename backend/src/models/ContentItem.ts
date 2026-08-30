import mongoose, { Schema } from "mongoose"

const localizedSchema = new Schema(
  {
    ar: { type: String, default: "" },
    en: { type: String, default: "" },
  },
  { _id: false },
)

const contentItemSchema = new Schema(
  {
    type: { type: String, enum: ["solution", "product", "use-case", "article", "case", "job", "campaign"], required: true, index: true },
    slug: { type: String, required: true, unique: true, index: true },
    groupSlug: { type: String, default: "" },
    groupTitle: { type: localizedSchema, default: () => ({ ar: "", en: "" }) },
    title: { type: localizedSchema, required: true },
    excerpt: { type: localizedSchema, default: () => ({ ar: "", en: "" }) },
    description: { type: localizedSchema, default: () => ({ ar: "", en: "" }) },
    features: {
      ar: { type: [String], default: [] },
      en: { type: [String], default: [] },
    },
    image: { type: String, default: "" },
    contactPhone: { type: String, default: "" },
    officialWebsite: { type: String, default: "" },
    officialEmail: { type: String, default: "" },
    profileDescription: { type: localizedSchema, default: () => ({ ar: "", en: "" }) },
    published: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true },
)

contentItemSchema.index({ type: 1, sortOrder: 1 })

export const ContentItem = mongoose.model("ContentItem", contentItemSchema)

export type ContentType = "solution" | "product" | "use-case" | "article" | "case" | "job" | "campaign"

export function serializeContentItem(item: InstanceType<typeof ContentItem>) {
  return {
    id: item._id.toString(),
    type: item.type,
    slug: item.slug,
    groupSlug: item.groupSlug,
    groupTitle: item.groupTitle,
    title: item.title,
    excerpt: item.excerpt,
    description: item.description,
    features: item.features,
    image: item.image ?? "",
    contactPhone: item.contactPhone ?? "",
    officialWebsite: item.officialWebsite ?? "",
    officialEmail: item.officialEmail ?? "",
    profileDescription: item.profileDescription ?? { ar: "", en: "" },
    published: item.published,
    sortOrder: item.sortOrder,
    updatedAt: item.updatedAt,
  }
}
