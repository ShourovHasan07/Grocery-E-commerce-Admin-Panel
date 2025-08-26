// Next Imports
import { getServerSession } from "next-auth/next";

import { authOptions } from "@/libs/auth";

import pageApiHelper from "@/utils/pageApiHelper";

import BookingsDetails from "@/views/apps/bookings/bokingsdetails/BookingDetail";
import NotFound from "@/components/NotFound";

const getBookingData = async (id) => {
  // Vars
  const session = await getServerSession(authOptions);

  if (session.accessToken) {
    try {
      // Fetching the categories data
      const result = await pageApiHelper.get(
        `bookings/${id}`,
        {},
        session.accessToken,
      );

      //console.log("Bookings Data:", result);

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
};

export const metadata = {
  title: "users Detail's - AskValor",
};

const UserApp = async ({ params }) => {
  const { id } = await params;
  const result = await getBookingData(id);
  const bookings = result;

  if (!result || !result.booking || !result.booking.id) {
    return (
      <NotFound
        title="Booking Not Found"
        message="Sorry, we could not find the booking you requested."
        buttonLabel="Back to booking List"
        redirectPath="/bookings"
      />
    );
  }

  // console.log(user)

  return <BookingsDetails booking={bookings.booking} />;
};

export default UserApp;
