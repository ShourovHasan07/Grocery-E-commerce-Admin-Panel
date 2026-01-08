"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";

export default function ClientTokenGuard({ session, children }) {
  const router = useRouter();

  useEffect(() => {
    // session 
    if (session === undefined) return;

    //  session 
    if (session === null) {
      signOut({ redirect: false });
      router.replace("/login");
      return;
    }

    //  session valid → nothing to do
  }, [session, router]);

  return <>{children}</>;
}



// // components/ClientTokenGuard.jsx
// "use client";

// import { useEffect } from "react";

// import { signOut } from "next-auth/react";

// import { checkTokenExpiration } from "@/utils/checkTokenExpiration";
// import AuthRedirect from "@/components/AuthRedirect";

// export default function ClientTokenGuard({ session, children }) {
//   const validateToken = async (session) => {
//     const tokenCheck = await checkTokenExpiration(session);

//     console.log("Token valid  auth redirect :", tokenCheck.isValid);



//     if (!tokenCheck.isValid) {
//       await signOut({ callbackUrl: process.env.NEXT_PUBLIC_APP_URL });

//       return <AuthRedirect />;
//     }
//   };

//   useEffect(() => {
//     validateToken(session);
//   }, [session]);

//   return <>{children}</>;
// }
