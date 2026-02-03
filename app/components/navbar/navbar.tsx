"use client";

import { Authenticated, Unauthenticated } from "convex/react";
import { SignInButton, UserButton } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Link from "next/link";
import { Suspense, useState } from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
} from "@heroui/react";
import { menuItem } from "./menu";

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
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <Navbar
      shouldHideOnScroll
      onMenuOpenChange={setIsMenuOpen}
      isMenuOpen={isMenuOpen}
      className="mb-5"
    >
      <NavbarContent>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        />
        <NavbarBrand>
          <Link className="font-bold text-inherit flex items-center" href="/">
            <AcmeLogo />
            Platform
          </Link>
        </NavbarBrand>
      </NavbarContent>

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
      <NavbarMenu>
        {menuItem.map((item, index) => {
          return (
            <NavbarMenuItem
              key={`${item}-${index}`}
              className="flex text-center "
            >
              <Link
                color={"primary"}
                href={item.url}
                className="w-full items-center text-4xl hover:text-blue-500 hover:scale-110 duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </Link>
            </NavbarMenuItem>
          );
        })}
      </NavbarMenu>
    </Navbar>
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
