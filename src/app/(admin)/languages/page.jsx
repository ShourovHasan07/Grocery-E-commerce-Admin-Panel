// Component Imports
import { getServerSession } from 'next-auth';

import { authOptions } from "@/libs/auth";

import LanguageList from "@/views/apps/languages/list";
import apiHelper from "@/utils/apiHelper";

export const metadata = {
  title: "Categories - AskValor",
};

const getData = async () => {

  const session = await getServerSession(authOptions)

  if (session.accessToken) {
    try {
      // Fetching the languages data
      const result = await apiHelper.get('languages', { pageSize: 200 }, session);

      if (result.success) {
        return result.data;
      }

      return null;
    } catch (error) {
      // console.error('Error fetching languages:', error);

      return null;
    }
  }

  return null;
}

const ListApp = async () => {

  const dataLanguages = await getData();

  // console.log(dataLanguages);

  return <LanguageList tData={dataLanguages} />;
};

export default ListApp;
