"use client";

// Third-party Imports
import { SessionProvider } from "next-auth/react";

export const NextAuthProvider = ({ children, ...props }) => {
  return <SessionProvider {...props}>{children}</SessionProvider>;
};
