// Component Imports
import { getServerSession } from 'next-auth';

import { authOptions } from "@/libs/auth";

import CategoryList from "@/views/apps/categories/list";
import apiHelper from "@/utils/apiHelper";

const getCategoryData = async () => {

  const session = await getServerSession(authOptions)

  if (session.accessToken) {
    try {
      // Fetching the categories data

      // const res = await fetch(`${process.env.ADMIN_API_BASE_URL}/categories?pageSize=200`, {
      //   method: 'GET',
      //   headers: {
      //     'Authorization': `Bearer ${session.accessToken}`,
      //     'Content-Type': 'application/json'
      //   }
      // });

      // if (res.ok) {
      //   return res.json();
      // }

      // Using the API helper - much cleaner!
      const result = await apiHelper.get('/categories', { pageSize: 200 }, session);

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

  const dataCategories = await getCategoryData();

  // console.log(dataCategories);

  return <CategoryList tData={dataCategories} />;
};

export default ListApp;
