
import { getServerSession } from "next-auth";

import ClientTokenGuard from './ClientTokenGuard';

import { authOptions } from "@/libs/auth";

// Component Imports
import AuthRedirect from "@/components/AuthRedirect";

export default async function AuthGuard({ children }) {
  const session = await getServerSession(authOptions);

  // Check if session exists
  if (!session) {
    return <AuthRedirect />;
  }

  // Let client component handle token validation
  return (
    <ClientTokenGuard session={session}>
      {children}
    </ClientTokenGuard>
  );
}
