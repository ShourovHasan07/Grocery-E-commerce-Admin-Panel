import { getServerSession } from "next-auth/next";

import { authOptions } from "@/libs/auth";
import apiHelper from "@/utils/apiHelper";

// Component Imports
import ExpertAchievement from "@/views/apps/experts/achievements";

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
  title: "Expert Achievement - AskValor",
};

const ExpertAchievementApp = async ({ params }) => {
  // Vars
  const { id } = await params;
  const { expert } = await getExpertData(id);
  const { achievements } = await getOptionData();


  return <ExpertAchievement expertData={expert} achievementData={achievements} />;
};

export default ExpertAchievementApp;
