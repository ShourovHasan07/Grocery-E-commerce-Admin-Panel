import { getServerSession } from "next-auth/next";

import { authOptions } from "@/libs/auth";
import apiHelper from "@/utils/apiHelper";

// Component Imports
import ExpertLanguage from "@/views/apps/experts/languases";

const getExpertData = async (id) => {
  // Vars
  const session = await getServerSession(authOptions)

  if (session.accessToken) {
    try {
      // Fetching the categories data
      const result = await apiHelper.get(`experts/${id}`, session);

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
}

// expert option options data
const getOptionData = async () => {
  // Vars
  const session = await getServerSession(authOptions)

  if (session.accessToken) {
    try {
      // Fetching the categories data
      const result = await apiHelper.get('experts/create/options', session);

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
}

export const metadata = {
  title: "Expert Language - AskValor",
};

const ExpertLanguageApp = async ({ params }) => {
  // Vars
  const { id } = await params;
  const { expert } = await getExpertData(id);
  const { languages } = await getOptionData();


  return <ExpertLanguage expertData={expert} languageData={languages} />;
};

export default ExpertLanguageApp;
