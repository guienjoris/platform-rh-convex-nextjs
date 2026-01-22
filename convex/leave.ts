import { mutation, QueryCtx, query } from "./_generated/server";
import { v } from "convex/values";

export const saveLeave = mutation({
  args: {
    assignerId: v.id("users"),
    assignedId: v.id("users"),
    leaveType: v.id("leavetypes"),
    startDate: v.string(),
    comment: v.optional(v.string()),
    endDate: v.string(),
    timeZone: v.optional(v.string()),
  },
  handler: async (
    ctx,
    { assignerId, assignedId, leaveType, startDate, endDate },
  ) => {
    if (assignerId === assignedId) {
      ctx.db.insert("leaves", {
        assignerId,
        assignedId,
        leaveType,
        startDate: startDate,
        endDate: endDate,
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      });
    }
  },
});

export const getLeaveTypes = query({
  args: {},
  handler: async (ctx: QueryCtx) => {
    return ctx.db.query("leavetypes").collect();
  },
});
