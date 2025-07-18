import { getServerSession } from "next-auth/next";

import { authOptions } from "@/libs/auth";
import apiHelper from "@/utils/apiHelper";

// Component Imports
import ExpertLanguage from "@/views/apps/experts/languages";
import pageApiHelper from "@/utils/pageApiHelper";

const getExpertData = async (id) => {

  //console.log("Fetching expert data for ID:", id);
  // Vars
  const session = await getServerSession(authOptions)

  if (session.accessToken) {
    try {
      // Fetching the categories data
    const result = await pageApiHelper.get(`experts/${id}/languages`, { pageSize: 200 }, session.accessToken);

    //console.log("languages data:", result);
    

      if (result.success) {
        return result;
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
  const result  = await getExpertData(id);
   const expert = result?.data

   //console.log("expert data:", expert);

  const { languages } = await getOptionData();

  return <ExpertLanguage expertData={expert} languageData={languages} />;
};

export default ExpertLanguageApp;
