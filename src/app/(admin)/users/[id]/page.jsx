// Next Imports
import { getServerSession } from "next-auth/next";

import Grid from "@mui/material/Grid2";

import { authOptions } from "@/libs/auth";

import pageApiHelper from "@/utils/pageApiHelper";

import UsersDetails from "@/views/apps/users/userDetail";


const getUserData = async (id) => {
  // Vars
  const session = await getServerSession(authOptions)

  if (session.accessToken) {
    try {
      // Fetching the categories data
      const result = await pageApiHelper.get(`users/${id}`, {}, session.accessToken);

      if (result.success && result?.data?.data) {
        return result.data.data;
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
  title: "User Detail's - AskValor",
};

const UserApp = async ({ params }) => {
  const { id } = await params
  const res = await getUserData(id);
  const user = res?.user || []

  // console.log(user)

  return <UsersDetails user={user} />;
};

export default UserApp;
