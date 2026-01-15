import { query, mutation, internalMutation } from "./_generated/server";
import { v } from "convex/values";

export const get = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("users").collect();
  },
});

export const updateUser = internalMutation({
  args: { userId: v.id("users"), key: v.string(), value: v.any() },
  handler: async (ctx, args) => {
    await ctx.db.patch("users", args.userId, {
      [args.key]: args.value,
    });
  },
});

export const getForCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (identity === null) {
      throw new Error("Not authenticated");
    }

    const externalId = identity.subject;

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("subject", externalId))
      .unique();

    console.log({ user });
    if (user) {
      return user;
    }

    return identity;

    // if (user !== null) {
    //   // Example: keep name in sync if it changed
    //   if (user.lastname !== identity.lastname) {
    //     await ctx.db.patch("users", user._id, {
    //       lastname: (identity.lastname as string) ?? "Anonymous",
    //     });
    //   }
    //   return user;
    // }

    // return await ctx.db.insert("users", {
    //   firstname: identity.givenName ?? "Anonymous",
    //   lastname: (identity.lastname as string) ?? "Anonymous",
    //   email: identity.email as string,
    //   role: "collaborator",
    //   gender: "other",
    //   subject: identity.subject,
    // });
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
    subject: v.string(),
  },
  handler: async (
    ctx,
    { firstname, lastname, email, role, gender, subject },
  ) => {
    return await ctx.db.insert("users", {
      firstname,
      lastname,
      email,
      role,
      gender,
      subject,
    });
  },
});
