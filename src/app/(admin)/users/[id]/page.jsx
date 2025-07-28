// Next Imports
import { getServerSession } from "next-auth/next";

import Grid from "@mui/material/Grid2";

import { authOptions } from "@/libs/auth";

import pageApiHelper from "@/utils/pageApiHelper";

import UsersListDetails from "@/views/apps/users/userDetails Table";




const getUserstData = async (id) => {
  // Vars
  const session = await getServerSession(authOptions)

  if (session.accessToken) {
    try {
      // Fetching the categories data
      const result = await pageApiHelper.get(`users/${id}`, {}, session.accessToken);

      console.log("User Details Data:", result);

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
  title: "users Detail's - AskValor",
};

const ListApp = async () => {
  const result = await getUserstData();
  const usersData = result

  return < UsersListDetails tData={usersData} />;
};

export default ListApp;
