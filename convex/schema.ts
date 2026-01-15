import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema(
  {
    users: defineTable({
      firstname: v.string(),
      lastname: v.string(),
      role: v.union(
        v.literal("admin"),
        v.literal("collaborator"),
        v.literal("rh"),
      ),
      email: v.string(),
      gender: v.union(
        v.literal("male"),
        v.literal("female"),
        v.literal("other"),
      ),
      subject: v.string(),
    }).index("by_token", ["subject"]),
  },
  { schemaValidation: true },
);
