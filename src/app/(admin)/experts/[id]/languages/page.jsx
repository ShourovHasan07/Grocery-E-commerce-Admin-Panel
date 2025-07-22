import { getServerSession } from "next-auth/next";

import { authOptions } from "@/libs/auth";
import apiHelper from "@/utils/apiHelper";

// Component Imports
import ExpertLanguage from "@/views/apps/experts/languages";
import pageApiHelper from "@/utils/pageApiHelper";

const getExpertData = async (id) => {

  // Vars
  const session = await getServerSession(authOptions)

  if (session.accessToken) {
    try {
      // Fetching the categories data
      const result = await pageApiHelper.get(`experts/${id}/language`, { pageSize: 200 }, session.accessToken);




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
let result

// expert option options data
const getOptionData = async () => {
  // Vars
  const session = await getServerSession(authOptions)

  if (session.accessToken) {
    try {
      // Fetching the categories data
      const result = await pageApiHelper.get('experts/create-options', { pageSize: 200 }, session.accessToken);


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
  const expertData = await getExpertData(id);

  const result = await getOptionData();


  const languages = result.data.languages

  return <ExpertLanguage expertData={expertData} languageData={languages} />;
};

export default ExpertLanguageApp;
