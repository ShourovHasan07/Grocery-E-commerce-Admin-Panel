import { getServerSession } from "next-auth/next";

import { authOptions } from "@/libs/auth";

// Component Imports
import ExpertLanguage from "@/views/apps/experts/languages";
import pageApiHelper from "@/utils/pageApiHelper";

const getExpertWithListData = async (id) => {
  // Vars
  const session = await getServerSession(authOptions);

  if (session.accessToken) {
    try {
      // Fetching the categories data
      const result = await pageApiHelper.get(
        `experts/${id}/language`,
        { pageSize: 200 },
        session.accessToken,
      );

      if (result.success) {
        return result.data;
      }

      return null;
    } catch (error) {
      //  console.error('Error fetching categories:', error);

      return null;
    }
  }

  return null;
};

// expert option options data
const getOptionData = async () => {
  // Vars
  const session = await getServerSession(authOptions);

  if (session?.accessToken) {
    try {
      // Fetching the categories data
      const result = await pageApiHelper.get(
        "experts/menu-options",
        { model: "languages" },
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
  title: "Expert Language - AskValor",
};

const ExpertLanguageApp = async ({ params }) => {
  // Vars
  const { id } = await params;
  const { expert } = await getExpertWithListData(id);

  const result = await getOptionData();
  const languages = result?.data?.languages || [];

  return <ExpertLanguage expert={expert} languageDropdown={languages} />;
};

export default ExpertLanguageApp;
