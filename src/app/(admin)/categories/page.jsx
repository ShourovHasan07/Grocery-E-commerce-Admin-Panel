// Component Imports
import { getServerSession } from 'next-auth';

import { authOptions } from "@/libs/auth";

import CategoryList from "@/views/apps/categories/list";
import pageApiHelper from "@/utils/pageApiHelper";

export const metadata = {
  title: "Categories - AskValor",
};

const getCategoryData = async () => {
  const session = await getServerSession(authOptions)

  // console.log("Session:", session);

  if (session.accessToken) {
    try {
      // Fetching the categories data
      const result = await pageApiHelper.get('categories', { pageSize: 200 }, session.accessToken);

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

const ListApp = async () => {
  const { data } = await getCategoryData();

  return <CategoryList tData={data} />;
};

export default ListApp;
