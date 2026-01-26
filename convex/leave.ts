import { mutation, QueryCtx, query } from "./_generated/server";
import { v } from "convex/values";
import { getUserByIdFunction } from "./users";
import { Id } from "./_generated/dataModel";

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

export const getLeavesForMe = query({
  args: {
    assignedId: v.id("users"),
  },
  handler: async (ctx, { assignedId }) => {
    const leaves = await ctx.db
      .query("leaves")
      .withIndex("by_assigned_id", (leave) =>
        leave.eq("assignedId", assignedId),
      )
      .collect();

    if (!leaves) {
      return null;
    }

    return {
      leaves: await Promise.all(
        leaves.map(async (leave) => ({
          ...leave,
          assigned: await getUserByIdFunction(ctx, { id: leave.assignedId }),
          assigner: await getUserByIdFunction(ctx, { id: leave.assignerId }),
          leaveType: await getLeaveTypeByIdFunction(ctx, {
            id: leave.leaveType,
          }),
          ...(leave.validatedBy && {
            validator: await getUserByIdFunction(ctx, {
              id: leave.validatedBy,
            }),
          }),
        })),
      ),
    };
  },
});

export const getLeaveTypes = query({
  args: {},
  handler: async (ctx: QueryCtx) => {
    return ctx.db.query("leavetypes").collect();
  },
});

export const getLeaveTypesById = query({
  args: {
    id: v.id("leavetypes"),
  },
  handler: async (ctx, args) => {
    return getLeaveTypeByIdFunction(ctx, args);
  },
});

/*UTILS */

export const getLeaveTypeByIdFunction = async (
  ctx: QueryCtx,
  args: { id: Id<"leavetypes"> },
) => {
  return await ctx.db
    .query("leavetypes")
    .withIndex("by_id", (q) => q.eq("_id", args.id))
    .unique();
};
