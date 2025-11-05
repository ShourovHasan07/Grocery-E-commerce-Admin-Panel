// Component Imports
import { getServerSession } from "next-auth";

import { authOptions } from "@/libs/auth";

import pageApiHelper from "@/utils/pageApiHelper";
import MenuList from "@/views/apps/menus/list";

export const metadata = {
  title: "Menus - AskValor",
};

const getData = async () => {
  const session = await getServerSession(authOptions);

  if (session?.accessToken) {
    try {
      // Fetching the languages data
      const result = await pageApiHelper.get(
        "menus",
        { pageSize: 200 },
        session.accessToken,
      );

      //console.log("Menus Data:", result);
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
  const result = await getData();
  const menusData = result.data;

  return <MenuList tData={menusData} />;
};

export default ListApp;
