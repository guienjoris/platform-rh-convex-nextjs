import { Id } from "./_generated/dataModel";
import { query, mutation, QueryCtx } from "./_generated/server";
import { v } from "convex/values";

export const get = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("users").collect();
  },
});

export const updateUser = mutation({
  args: {
    userId: v.id("users"),
    user: v.object({
      firstname: v.string(),
      lastname: v.string(),
      email: v.string(),
      role: v.optional(
        v.union(v.literal("admin"), v.literal("collaborator"), v.literal("rh")),
      ),
      gender: v.union(
        v.literal("male"),
        v.literal("female"),
        v.literal("other"),
      ),
      manager: v.optional(v.id("users")),
    }),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch("users", args.userId, args.user);
  },
});

export const getConnectedAndCompletedUser = query({
  args: {
    subject: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("by_subject", (q) => q.eq("subject", args.subject))
      .unique();
  },
});

export const getUserById = query({
  args: {
    id: v.id("users"),
  },
  handler: async (ctx, args) => {
    return getUserByIdFunction(ctx, args);
  },
});

export const getNmoins1 = query({
  args: { managerId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("by_manager", (user) => user.eq("manager", args.managerId))
      .collect();
  },
});

export const getForCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (identity === null) {
      return null;
    }

    return {
      ...identity,
      toComplete: true,
    };
  },
});

export const createUser = mutation({
  args: {
    firstname: v.string(),
    lastname: v.string(),
    email: v.string(),
    role: v.union(
      v.literal("admin"),
      v.literal("collaborator"),
      v.literal("rh"),
    ),
    gender: v.union(v.literal("male"), v.literal("female"), v.literal("other")),
    manager: v.optional(v.id("users")),
    subject: v.string(),
  },
  handler: async (
    ctx,
    { firstname, lastname, email, role, gender, subject, manager },
  ) => {
    const existingBySubject = await ctx.db
      .query("users")
      .withIndex("by_subject", (q) => q.eq("subject", subject))
      .first();

    const existingByEmail = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", email))
      .first();

    if (existingBySubject || existingByEmail) {
      throw new Error("Email or Subject already exists");
    }

    return await ctx.db.insert("users", {
      firstname,
      lastname,
      email,
      role,
      gender,
      manager,
      subject,
    });
  },
});

/* UTILS */

export const getUserByIdFunction = async (
  ctx: QueryCtx,
  args: { id: Id<"users"> },
) => {
  return await ctx.db
    .query("users")
    .withIndex("by_id", (q) => q.eq("_id", args.id))
    .unique();
};
