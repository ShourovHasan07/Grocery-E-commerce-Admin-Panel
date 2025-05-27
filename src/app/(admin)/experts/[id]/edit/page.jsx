import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/auth";
import apiHelper from "@/utils/apiHelper";

// Component Imports
import ExpertEdit from "@/views/apps/experts/edit";

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

// expert category options data
const getCategoryData = async () => {
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

const ExpertEditApp = async ({ params }) => {
  // Vars
  const { id } = await params;
  const { expert } = await getExpertData(id);
  const { categories } = await getCategoryData();


  return <ExpertEdit expertData={expert} categoryData={categories} />;
};

export default ExpertEditApp;
