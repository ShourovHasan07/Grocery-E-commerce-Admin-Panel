// Component Imports
import { getServerSession } from 'next-auth';

import { authOptions } from "@/libs/auth";


import pageApiHelper from '@/utils/pageApiHelper';
import BookingsList from '@/views/apps/bookings/list';

export const metadata = {
  title: "Bookings - AskValor",
};

const getData = async () => {

  const session = await getServerSession(authOptions)

  if (session?.accessToken) {
    try {
      // Fetching the languages data
      const result = await pageApiHelper.get('bookings', { pageSize: 200 }, session.accessToken);
      //console.log("Bookings Data:", result);


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
   const bookingsData = result.data 

  return <BookingsList tData={bookingsData} />;
};

export default ListApp;
