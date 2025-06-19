// Component Imports
import { getServerSession } from 'next-auth';

import { authOptions } from "@/libs/auth";

import AchievementList from "@/views/apps/achievements/list";
import apiHelper from "@/utils/apiHelper";

export const metadata = {
  title: "Achievements - AskValor",
};

const getData = async () => {

  const session = await getServerSession(authOptions)

  if (session.accessToken) {
    try {
      // Fetching the achievements data
      const result = await apiHelper.get('achievements', { pageSize: 200 }, session);

      if (result.success) {
        return result.data;
      }

      return null;
    } catch (error) {
      // console.error('Error fetching achievements:', error);

      return null;
    }
  }

  return null;
}

const ListApp = async () => {

  const dataAchievement = await getData();

  // console.log(dataAchievement);

  return <AchievementList tData={dataAchievement} />;
};

export default ListApp;
