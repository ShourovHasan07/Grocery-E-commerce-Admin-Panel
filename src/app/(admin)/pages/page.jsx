// Component Imports
import { redirect } from "next/navigation";

import { getServerSession } from "next-auth";

import { authOptions } from "@/libs/auth";

import pageApiHelper from "@/utils/pageApiHelper";
import PagesList from "@/views/apps/pages/list";
import { defineAbilitiesFor } from "@/configs/acl";

export const metadata = {
  title: "Pages - AskValor",
};

const getData = async () => {
  const session = await getServerSession(authOptions);
    const ability = defineAbilitiesFor(session);

   

  if (session?.accessToken) {
    try {
      // Fetching the languages data
      const result = await pageApiHelper.get(
        "pages",
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
  const result = await getData();
  const usersData = result.data;

  return <PagesList tData={usersData} />;
};

export default ListApp;
