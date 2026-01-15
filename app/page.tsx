"use client";

import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { Authenticated, Unauthenticated } from "convex/react";
import { SignInButton, UserButton } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function Home() {
  return (
    <>
      <Authenticated>
        <UserButton />
        <ConnectedUser />
      </Authenticated>
      <Unauthenticated>
        <SignInButton />
      </Unauthenticated>
    </>
  );
}

function ConnectedUser() {
  const user = useQuery(api.users.getForCurrentUser);
  const router = useRouter();
  if (!user) {
    router.push("/create-user");
  }

  return <div>Info Utilisateur: {JSON.stringify(user)}</div>;
}
