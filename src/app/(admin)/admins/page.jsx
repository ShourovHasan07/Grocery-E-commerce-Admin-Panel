// Component Imports
import UserList from "@/views/apps/admins/list";

// Data Imports
//import { getUserData } from "@/app/server/actions";

import { getServerSession } from 'next-auth';

import { authOptions } from "@/libs/auth";


import pageApiHelper from '@/utils/pageApiHelper';


export const metadata = {
  title: "Admins - AskValor",
};

/**
 * ! If you need data using an API call, uncomment the below API code, update the `process.env.API_URL` variable in the
 * ! `.env` file found at root of your project and also update the API endpoints like `/apps/user-list` in below example.
 * ! Also, remove the above server action import and the action itself from the `src/app/server/actions.ts` file to clean up unused code
 * ! because we've used the server action for getting our static data.
 */
/* const getUserData = async () => {
  // Vars
  const res = await fetch(`${process.env.API_URL}/apps/user-list`)

  if (!res.ok) {
    throw new Error('Failed to fetch userData')
  }

  return res.json()
} */








const getUserData = async () => {

  const session = await getServerSession(authOptions)

  if (session.accessToken) {
    try {
      // Fetching the admins data
      const result = await pageApiHelper.get('admins', { pageSize: 200 }, session.accessToken);

     // console.log("admins data page.jsx:",result)

      

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










const UserListApp = async () => {
  // Vars
  const result = await getUserData();

 const adminData = result.data 
  return <UserList userData={adminData} />;
};

export default UserListApp;
