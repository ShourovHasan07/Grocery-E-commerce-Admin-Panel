import { getServerSession } from "next-auth/next";

import { authOptions } from "@/libs/auth";
import apiHelper from "@/utils/apiHelper";

// Component Imports
import AdminEdit from "@/views/apps/admins/edit/index";
import pageApiHelper from "@/utils/pageApiHelper";

const getAdminData = async (id) => {
  // Vars
  const session = await getServerSession(authOptions)

  if (session.accessToken) {
    try {
      // Fetching the categories data
      const result = await pageApiHelper.get(`admins/${id}`, {}, session.accessToken);

      if (result.success) {
        return result.data;
      }

      return null;
    } catch (error) {

      return null;
    }
  }

  return null;
}

export const metadata = {
  title: "Admins - AskValor",
};

const ExpertEditApp = async ({ params }) => {
  const { id } = await params;
  const res = await getAdminData(id);

  
  const adminData = res?.data?.admin || {}
  // console.log(adminData)

  return <AdminEdit adminData={adminData} />;
};

export default ExpertEditApp;
