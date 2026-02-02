"use client";

import { Authenticated, Unauthenticated } from "convex/react";
import { SignInButton, UserButton } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Link from "next/link";
import { Suspense } from "react";
import { Navbar, NavbarBrand, NavbarContent, NavbarItem } from "@heroui/react";

export const AcmeLogo = () => {
  return (
    <svg fill="none" height="36" viewBox="0 0 32 32" width="36">
      <path
        clipRule="evenodd"
        d="M17.6482 10.1305L15.8785 7.02583L7.02979 22.5499H10.5278L17.6482 10.1305ZM19.8798 14.0457L18.11 17.1983L19.394 19.4511H16.8453L15.1056 22.5499H24.7272L19.8798 14.0457Z"
        fill="currentColor"
        fillRule="evenodd"
      />
    </svg>
  );
};

export function NavbarComponent() {
  return (
    <Navbar shouldHideOnScroll>
      <NavbarBrand>
        <Link className="font-bold text-inherit flex items-center" href="/">
          <AcmeLogo />
          Platform
        </Link>
      </NavbarBrand>

      <NavbarContent justify="end">
        <Authenticated>
          <div className="flex space-x-3 items-center">
            <NavbarItem>
              <UserButton userProfileMode="modal" />
            </NavbarItem>
            <Suspense fallback={<div>Loading...</div>}>
              <NavbarItem>
                <ConnectedUser />
              </NavbarItem>
            </Suspense>
          </div>
        </Authenticated>
        <Unauthenticated>
          <NavbarItem>
            <SignInButton />
          </NavbarItem>
        </Unauthenticated>
      </NavbarContent>
    </Navbar>
  );
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
