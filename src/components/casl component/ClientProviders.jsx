'use client';
import { SessionProvider } from "next-auth/react";
import { AbilityProvider } from "@/contexts/AbilityContext";

export default function ClientProviders({ children }) {
  return (
    <SessionProvider>
      <AbilityProvider>
        {children}
      </AbilityProvider>
    </SessionProvider>
  );
}
