// Next Imports
import { getServerSession } from "next-auth/next";

import { authOptions } from "@/libs/auth";

import pageApiHelper from "@/utils/pageApiHelper";

// Component Imports
import Detail from "@/views/apps/pages/detail/Detail";

const getPageData = async (id) => {
  // Vars
  const session = await getServerSession(authOptions);

  if (session?.accessToken) {
    try {
      // Fetching the categories data
      const result = await pageApiHelper.get(
        `pages/${id}`,
        {},
        session.accessToken,
      );

      if (result.success) {
        return result.data;
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
  title: "Page Detail - AskValor",
};

const ExpertView = async ({ params }) => {
  // Vars
  const { id } = await params;

  const { data } = await getPageData(id);

  return <Detail page={data.page} />;
};

export default ExpertView;
