// Component Imports
import ExpertList from "@/views/apps/experts/list";

import { getServerSession } from 'next-auth';

import { authOptions } from "@/libs/auth";

import apiHelper from "@/utils/apiHelper";

const getExpertData = async () => {

  const session = await getServerSession(authOptions)

  if (session.accessToken) {
    try {
      // Fetching the experts data
      const result = await apiHelper.get('experts', { pageSize: 200 }, session);

      if (result.success) {
        return result.data;
      }

      return null;
    } catch (error) {
      // console.error('Error fetching experts:', error);

      return null;
    }
  }

  return null;
}
const ExpertListApp = async () => {
  // Vars
  const data = await getExpertData();

  return <ExpertList listData={data} />;
};

export default ExpertListApp;
