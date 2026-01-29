"use client";

import { ConvexReactClient } from "convex/react";
import { ReactNode } from "react";
import { useAuth } from "@clerk/clerk-react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { HeroUIProvider } from "@heroui/react";
import { ToastProvider } from "@heroui/toast";

if (!process.env.NEXT_PUBLIC_CONVEX_URL) {
  throw new Error("Missing NEXT_PUBLIC_CONVEX_URL in your .env file");
}

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export function ConvexClientProvider({ children }: { children: ReactNode }) {
  return (
    <HeroUIProvider locale="fr-FR">
      <ToastProvider />
      <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
        {children}
      </ConvexProviderWithClerk>
    </HeroUIProvider>
  );
}
