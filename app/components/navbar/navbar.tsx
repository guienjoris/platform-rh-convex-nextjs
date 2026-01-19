"use client";

import { Authenticated, Unauthenticated } from "convex/react";
import { SignInButton, UserButton } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Link from "next/link";
import { Suspense } from "react";

export function Navbar() {
  return (
    <div className="w-screen border-b-2 mb-2">
      <div className="flex justify-between items-center p-4">
        <div className="text-xl font-bold">
          <Link href="/">Platform</Link>
        </div>
        <div className="flex space-x-4">
          <Authenticated>
            <UserButton userProfileMode="modal" />
            <Suspense fallback={<div>Loading...</div>}>
              <ConnectedUser />
            </Suspense>
          </Authenticated>
          <Unauthenticated>
            <SignInButton />
          </Unauthenticated>
        </div>
      </div>
    </div>
  );
}

function ConnectedUser() {
  const identity = useQuery(api.users.getForCurrentUser);

  const user = useQuery(
    api.users.getConnectedAndCompletedUser,
    identity?.subject
      ? {
          subject: identity.subject,
        }
      : "skip",
  );
  return (
    <div>
      {user?.firstname} {user?.lastname}
    </div>
  );
}
