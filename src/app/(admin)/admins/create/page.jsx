// Component Imports
import { getServerSession } from "next-auth";

import AdminCreate from "@/views/apps/admins/create";

// Component Imports



import { authOptions } from "@/libs/auth";
import pageApiHelper from "@/utils/pageApiHelper";

export const metadata = {
  title: "Admins - AskValor",
};

const getAdminOptions = async () => {
  const session = await getServerSession(authOptions);

  if (session?.accessToken) {
    try {
      const result = await pageApiHelper.get(
        "admins/create-edit-options",
        { status: "active" },
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

const AdminApp = async () => {
  const result = await getAdminOptions();
  const createOptionData = result?.data?.roles || [];

  return <AdminCreate createOptionData={createOptionData} />;
};

export default AdminApp;
