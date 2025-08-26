// components/ClientTokenGuard.jsx
"use client";

import { useEffect } from "react";

import { signOut } from "next-auth/react";

import { checkTokenExpiration } from "@/utils/checkTokenExpiration";
import AuthRedirect from "@/components/AuthRedirect";

export default function ClientTokenGuard({ session, children }) {
  const validateToken = async (session) => {
    const tokenCheck = await checkTokenExpiration(session);

    if (!tokenCheck.isValid) {
      await signOut({ callbackUrl: process.env.NEXT_PUBLIC_APP_URL });

      return <AuthRedirect />;
    }
  };

  useEffect(() => {
    validateToken(session);
  }, [session]);

  return <>{children}</>;
}
