import { getServerSession } from "next-auth/next";

import { authOptions } from "@/libs/auth";
import apiHelper from "@/utils/apiHelper";

// Component Imports
import PageEdit from "@/views/apps/pages/edit";
import pageApiHelper from "@/utils/pageApiHelper";

const getExpertData = async (id) => {
  // Vars
  const session = await getServerSession(authOptions)

  if (session?.accessToken) {
    try {
      // Fetching the categories data
      const result = await pageApiHelper.get(`pages/${id}`, {}, session.accessToken);

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
  title: "Page Edit - AskValor",
};

const PageEditApp = async ({ params }) => {
  const { id } = await params;
  const editPage = await getExpertData(id);

  const pageData = editPage?.data?.page || {}

  return <PageEdit pageData={pageData} />;
};

export default PageEditApp;
