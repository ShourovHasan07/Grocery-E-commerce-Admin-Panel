// Component Imports
import { getServerSession } from "next-auth";

import AdminList from "@/views/apps/admins/list";

// Data Imports
//import { getUserData } from "@/app/server/actions";

import { authOptions } from "@/libs/auth";

import pageApiHelper from "@/utils/pageApiHelper";

export const metadata = {
  title: "Admins - AskValor",
};

const getAdminData = async () => {
  const session = await getServerSession(authOptions);

  if (session.accessToken) {
    try {
      const result = await pageApiHelper.get(
        "admins",
        { pageSize: 200 },
        session.accessToken,
      );

      if (result.success) {
        return result.data;
      }

      return null;
    } catch (error) {
      return null;
    }
  }

  return null;
};

const ListApp = async () => {
  // Vars
  const result = await getAdminData();

  const adminData = result?.data || [];

  return <AdminList userData={adminData} />;
};

export default ListApp;
