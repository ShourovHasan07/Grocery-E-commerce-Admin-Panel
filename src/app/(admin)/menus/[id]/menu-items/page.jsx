import { getServerSession } from "next-auth/next";

import { authOptions } from "@/libs/auth";
import pageApiHelper from "@/utils/pageApiHelper";

// Component Imports
import MenuItemsList from "@/views/apps/menus/menu-items";

const getMenuItemsData = async (id) => {
  // Vars
  const session = await getServerSession(authOptions);

  if (session?.accessToken) {
    try {
      // Fetching the categories data
      const result = await pageApiHelper.get(
        `menus/${id}/menu-items`,
        {},
        session.accessToken,
      );

      if (result.success && result?.data?.data) {
        return result.data.data;
      }

      return null;
    } catch (error) {
      // console.error('Error fetching categories:', error);

      return null;
    }
  }

  return null;
};

export const metadata = {
  title: "Menu Items - AskValor",
};

const MenuItemsApp = async ({ params }) => {
  // Vars
  const { id } = await params;
  const data = await getMenuItemsData(id);

  return (
    <MenuItemsList data={data} />
  );
};

export default MenuItemsApp;
