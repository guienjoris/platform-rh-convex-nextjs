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
      manager: v.optional(v.id("users")),
    })
      .index("by_subject", ["subject"])
      .index("by_email", ["email"])
      .index("by_manager", ["manager"]),
    leavetypes: defineTable({
      label: v.string(),
      code: v.string(),
    }),
    leaves: defineTable({
      assignerId: v.id("users"),
      assignedId: v.id("users"),
      leaveType: v.id("leavetypes"),
      comment: v.optional(v.string()),
      startDate: v.string(),
      endDate: v.string(),
      timeZone: v.optional(v.string()),
      validatedBy: v.optional(v.id("users")),
      validatedAt: v.optional(v.string()),
    })
      .index("by_assigner_id", ["assignerId"])
      .index("by_assigned_id", ["assignedId"])
      .index("by_validate_by", ["validatedBy"]),
  },
  { schemaValidation: true },
);
