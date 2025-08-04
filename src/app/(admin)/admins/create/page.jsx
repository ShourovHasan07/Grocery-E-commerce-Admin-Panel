// Component Imports
import UserCreate from "@/views/apps/admins/create";

// Data Imports
import { getUserData } from "@/app/server/actions";

// Component Imports
  import { getServerSession } from 'next-auth';
  
  import ExpertList from "@/views/apps/experts/list";
  
  import { authOptions } from "@/libs/auth";
  import pageApiHelper from '@/utils/pageApiHelper';
  





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
export const metadata = {
  title: "Admins - AskValor",
};











 const getAdminData = async () => {
  
    const session = await getServerSession(authOptions)
  
    if (session?.accessToken) {
      try {
        // Fetching the experts data
        const result = await pageApiHelper.post('admins', { pageSize: 200 }, session.accessToken);
        console.log("admins data page.jsx:",result)
  
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
  
 
  
  








const UserListApp = async () => {
  // Vars
  // const data = await getUserData();
  const data = {
    'roles': [{
      id: 1,
      name: "Admin",
      description: "Administrator role with full access"
    }, {
      id: 2,
      name: "Editor",
      description: "Editor role with limited access"
    }, {
      id: 3,
      name: "Viewer",
      description: "Viewer role with read-only access"
    }],
    'statuses': [{
      id: 1,
      name: "Active",
      description: "User is active and has access"
    }, {
      id: 2,
      name: "Inactive",
      description: "User is inactive and does not have access"
    }, {
      id: 3,
      name: "Pending",
      description: "User is pending approval"
    }],
  };

  return <UserCreate userData={data} />;
};

export default UserListApp;
