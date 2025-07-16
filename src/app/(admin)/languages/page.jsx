// Component Imports
import { getServerSession } from 'next-auth';

import { authOptions } from "@/libs/auth";

import LanguageList from "@/views/apps/languages/list";
import pageApiHelper from '@/utils/pageApiHelper';

export const metadata = {
  title: "Languages - AskValor",
};

const getData = async () => {

  const session = await getServerSession(authOptions)

  if (session.accessToken) {
    try {
      // Fetching the languages data
      const result = await pageApiHelper.get('languages', { pageSize: 200 }, session.accessToken);

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

  const { data }  = await getData();

  
  return <LanguageList tData={data} />;
};

export default ListApp;
