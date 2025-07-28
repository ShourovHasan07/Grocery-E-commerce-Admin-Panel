// Component Imports
import { getServerSession } from 'next-auth';

import { authOptions } from "@/libs/auth";


import pageApiHelper from '@/utils/pageApiHelper';
import BookingsList from '@/views/apps/bookings/list';
import UsersList from '@/views/apps/users/list';

export const metadata = {
  title: "users - AskValor",
};

const getData = async () => {

  const session = await getServerSession(authOptions)

  if (session?.accessToken) {
    try {
      // Fetching the languages data
      const result = await pageApiHelper.get('users', { pageSize: 200 }, session.accessToken);


     // console.log("users Data:", result);
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
  const result = await getData();
  const usersData = result.data

  return <UsersList  tData={usersData} />; 
};

export default ListApp;
