import { getServerSession } from "next-auth/next";

import { authOptions } from "@/libs/auth";
import apiHelper from "@/utils/apiHelper";

// Component Imports
import ExpertEdit from "@/views/apps/experts/edit";
import pageApiHelper from "@/utils/pageApiHelper";

const getExpertData = async (id) => {
  // Vars
  const session = await getServerSession(authOptions)

  if (session.accessToken) {
    try {
      // Fetching the categories data
      const result = await pageApiHelper.get(`experts/${id}/edit`, {}, session.accessToken);

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

// expert category options data
const getCategoryData = async () => {
  // Vars
  const session = await getServerSession(authOptions)

  if (session.accessToken) {
    try {
      // Fetching the categories data
      const result = await pageApiHelper.get('experts/create-edit-options', {}, session.accessToken);

      if (result.success) {
        return result.data;
      }

      return null;
    } catch (error) {
      ;

      return null;
    }
  }

  return null;
}

export const metadata = {
  title: "Experts - AskValor",
};

const ExpertEditApp = async ({ params }) => {
  const { id } = await params;
  const editExpert = await getExpertData(id);
  const result = await getCategoryData();

  const categories = result?.data?.categories || [];
  const expertData = editExpert?.data?.expert || {}

  return <ExpertEdit expertData={expertData} categoryData={categories} />;
};

export default ExpertEditApp;
