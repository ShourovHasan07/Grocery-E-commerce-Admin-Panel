import { getServerSession } from "next-auth/next";

import { authOptions } from "@/libs/auth";

// Component Imports
import MenuEdit from "@/views/apps/menus/edit";
import pageApiHelper from "@/utils/pageApiHelper";

const getMenuData = async (id) => {
  // Vars
  const session = await getServerSession(authOptions);

  if (session.accessToken) {
    try {
      // Fetching the categories data
      const result = await pageApiHelper.get(
        `menus/${id}`,
        {},
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


export const metadata = {
  title: "Menus - AskValor",
};

const MenuEditApp = async ({ params }) => {
  const { id } = await params;
  const editMenu = await getMenuData(id);

  const menuData = editMenu?.data?.menu || {};

  return <MenuEdit menuData={menuData} />;
};

export default MenuEditApp;
