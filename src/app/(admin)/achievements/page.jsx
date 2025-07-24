// Component Imports
import { getServerSession } from 'next-auth';

import { authOptions } from "@/libs/auth";

import AchievementList from "@/views/apps/achievements/list";

import pageApiHelper from '@/utils/pageApiHelper';

export const metadata = {
  title: "Achievements - AskValor",
};

const getData = async () => {

  const session = await getServerSession(authOptions)

  if (session.accessToken) {
    try {
      // Fetching the achievements data
      const result = await pageApiHelper.get('achievements', { pageSize: 200 }, session.accessToken);

      

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

const ListApp = async () => {

  const {data} = await getData();



  return <AchievementList tData={data} />;
};

export default ListApp;
