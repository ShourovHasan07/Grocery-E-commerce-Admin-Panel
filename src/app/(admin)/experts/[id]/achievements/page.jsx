import { getServerSession } from "next-auth/next";

import { authOptions } from "@/libs/auth";
import pageApiHelper from "@/utils/pageApiHelper";

// Component Imports
import ExpertAchievement from "@/views/apps/experts/achievements";


const getExpertData = async (id) => {
  // Vars
  const session = await getServerSession(authOptions)

  if (session.accessToken) {


    try {
      // Fetching the categories data
     const result = await pageApiHelper.get(`experts/${id}/achievements`, { pageSize: 200 }, session.accessToken);

      
      

       
      

      if (result.success) {
        return result.data
      }

      return null;
    } catch (error) {
      // console.error('Error fetching categories:', error);

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
      // Fetching the experts data
      const result = await pageApiHelper.get('experts/create-options',{ pageSize: 200 }, session.accessToken);

      /// console.log("Expert options data:", result);

      
      if (result.success) {
        return result.data;
      }

      return null;
    } catch (error) {
    //console.error('Error fetching categories:', error);

      return null;
    }
  }

  return null;
}

export const metadata = {
  title: "Expert Achievement - AskValor",
};


const ExpertAchievementApp = async ({ params }) => {
  // Vars
  const { id } = await  params;
  const expertData = await getExpertData(id);

  //console.log("Expert Achievement Data:", expertData);

   

  const result  = await getOptionData();

  
  const achievements = result.data.achievements

    //console.log("Expert Achievements:", achievements);


  return <ExpertAchievement expertData={expertData} achievementData={achievements} />;
};

export default ExpertAchievementApp;
