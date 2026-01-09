import { getServerSession } from "next-auth/next";

import { authOptions } from "@/libs/auth";

// Component Imports
import AdminEdit from "@/views/apps/admins/edit/index";
import pageApiHelper from "@/utils/pageApiHelper";


const getAdminData = async (id, abortControllerRef) => {
  try {
    // session 
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;

    if (!token) return null;

    // abort signal
    const signal = abortControllerRef?.current?.signal;

    // fetch request
    const response = await fetch(`http://localhost:4000/admin/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      signal, // important for canceling request
    });

    if (!response.ok) {
      console.error("Error fetching admin data:", response.status);
      return null;
    }

    const result = await response.json();
    //console.log("Admin Data Response:", result);

    return result || null;
  } catch (error) {
    if (error.name === "AbortError") {
      console.log("Request cancelled");
    } else {
      console.error("Fetch admin data error:", error);
    }
    return null;
  }
};





//   const session = await getServerSession(authOptions);

//   if (session?.accessToken) {
//     try {
//       const result = await pageApiHelper.get(
//         "admins/create-edit-options",
//         { status: "active" },
//         session.accessToken,
//       );

//       if (result.success) {
//         return result.data;
//       }

//       return null;
//     } catch (error) {
//       return null;
//     }
//   }

//   return null;
// };

export const metadata = {
  title: "Admins - AskValor",
};

const ExpertEditApp = async ({ params }) => {
  const { id } = await params;
  const result = await getAdminData(id);
  const adminData = result|| {};

  

  return <AdminEdit adminData={adminData}  />;
};

export default ExpertEditApp;
