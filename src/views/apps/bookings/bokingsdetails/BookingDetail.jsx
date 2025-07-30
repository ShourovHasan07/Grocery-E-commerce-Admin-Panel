"use client";

// MUI Imports
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid2";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import { useRouter } from "next/navigation";


import { activeStatusLabel, activeStatusColor } from "@/utils/helpers";
import { formattedDate } from "@/utils/formatters";
import NotFound from "@/components/Not-Found -component/NotFound";
import Link from "@/components/Link";



const BookingInfo = ({ booking }) => {

  //console.log("Bookingdetails component  :", booking);


  const router = useRouter();

  // if user data is invalid
  const isBookingInvalid =
    !booking ||
    typeof booking !== "object" ||
    booking === null ||
    Array.isArray(booking) ||
    Object.keys(booking).length === 0;

  if (isBookingInvalid) {
    return (
      <NotFound
        title="Booking Not Found"
        message="Sorry, we could not find the booking you requested."
        buttonLabel="Back to booking List"
        redirectPath="/bookings"
      />
    );
  }



  return (
    <Card className="mb-4">
      <CardHeader title="Booking  Info" />
      <CardContent>
        <Grid size={{ xs: 12 }}>
          <div className="w-full overflow-x-auto">
            <table className="w-full table-auto border-collapse">
              <tbody>
                <tr className="text-left">
                  <th className="border px-4 py-2 w-1/5">ID</th>
                  <td className="border px-4 py-2 w-4/5">{booking.id}</td>
                </tr>
                <tr className="text-left">
                  <th className="border px-4 py-2 w-1/5">user ID</th>
                  <td className="border px-4 py-2 w-4/5">{booking.userId}</td>
                </tr>
                <tr className="text-left">
                  <th className="border px-4 py-2 w-1/5">Expert ID</th>
                  <td className="border px-4 py-2 w-4/5">{booking.expertId}</td>
                </tr>
                <tr className="text-left">
                  <th className="border px-4 py-2 w-1/5">Availability ID</th>
                  <td className="border px-4 py-2 w-4/5">{booking.availabilityId}</td>
                </tr>
                <tr className="text-left">
                  <th className="border px-4 py-2 w-1/5">TimeSlot ID</th>
                  <td className="border px-4 py-2 w-4/5">{booking.timeSlotId}</td>
                </tr>
                <tr className="text-left">
                  <th className="border px-4 py-2 w-1/5">SessionFee ID</th>
                  <td className="border px-4 py-2 w-4/5">{booking.sessionFeeId}</td>
                </tr>
                <tr className="text-left">
                  <th className="border px-4 py-2 w-1/5">Booking Date</th>
                  <td className="border px-4 py-2 w-4/5">{booking.bookingDate}</td>
                </tr>
                <tr className="text-left">
                  <th className="border px-4 py-2 w-1/5">Start Time</th>
                  <td className="border px-4 py-2 w-4/5">{booking.startTime}</td>
                </tr>
                <tr className="text-left">
                  <th className="border px-4 py-2 w-1/5">End Time</th>
                  <td className="border px-4 py-2 w-4/5">{booking.endTime}</td>
                </tr>
                <tr className="text-left">
                  <th className="border px-4 py-2 w-1/5">Time Min</th>
                  <td className="border px-4 py-2 w-4/5">{booking.timeMin}</td>
                </tr>
                <tr className="text-left">
                  <th className="border px-4 py-2 w-1/5">Payment Option</th>
                  <td className="border px-4 py-2 w-4/5">{booking.paymentOption}</td>
                </tr>
                <tr className="text-left">
                  <th className="border px-4 py-2 w-1/5">Transaction ID</th>
                  <td className="border px-4 py-2 w-4/5">{booking.transactionId}</td>
                </tr>
                <tr className="text-left">
                  <th className="border px-4 py-2 w-1/5">Fee</th>
                  <td className="border px-4 py-2 w-4/5">{booking.Fee}</td>
                </tr>
                <tr className="text-left">
                  <th className="border px-4 py-2 w-1/5">Service Charge</th>
                  <td className="border px-4 py-2 w-4/5">{booking.serviceCharge}</td>
                </tr>
                <tr className="text-left">
                  <th className="border px-4 py-2 w-1/5">Discount</th>
                  <td className="border px-4 py-2 w-4/5">{booking.discount}</td>
                </tr>
                <tr className="text-left">
                  <th className="border px-4 py-2 w-1/5">Total</th>
                  <td className="border px-4 py-2 w-4/5">{booking.total}</td>
                </tr>

                <tr className="text-left">
                  <th className="border px-4 py-2 w-1/5">Status</th>
                  <td className="border px-4 py-2 w-4/5">
                    <Chip
                      variant="tonal"
                      label={activeStatusLabel(booking.status)}
                      size="small"
                      color={activeStatusColor(booking.status)}
                      className="capitalize"
                    />
                  </td>
                </tr>



                <tr className="text-left">
                  <th className="border px-4 py-2 w-1/5">CreatedAt</th>
                  <td className="border px-4 py-2 w-4/5">{formattedDate(booking.createdAt)}</td>
                </tr>

                <tr className="text-left">
                  <th className="border px-4 py-2 w-1/5">UpdatedAt</th>
                  <td className="border px-4 py-2 w-4/5">{formattedDate(booking.updatedAt)}</td>
                </tr>



                <tr className="text-left">
                  <th className="border px-4 py-2 w-1/5 align-top">Expert</th>
                  <td className="border px-4 py-2 w-4/5">
                    <Link href={`/experts/${booking.expert.id}`} className="text-blue-600 hover:underline">
                      {booking.expert.name}
                    </Link>
                  </td>
                </tr>


                <tr className="text-left">
                  <th className="border px-4 py-2 w-1/5 align-top">Client</th>
                  <td className="border px-4 py-2 w-4/5">
                    <Link href={`/users/${booking.user.id}`} className="text-blue-600 hover:underline">
                      {booking.user.name}
                    </Link>
                  </td>
                </tr>

               


                <tr className="text-left">
  <th className="border px-4 py-2 w-1/5 align-top">Transactions</th>
  <td className="border px-4 py-2 w-4/5">
    {booking.transactions?.length > 0 ? (
      <div className="overflow-x-auto">
        <table className="table-auto w-full border-collapse border">
          <thead>
            <tr className="bg-gray-100 text-sm">
              <th className="border px-2 py-1">#</th>
              <th className="border px-2 py-1">Transaction ID</th>
              <th className="border px-2 py-1">User ID</th>
              <th className="border px-2 py-1">Expert ID</th>
              <th className="border px-2 py-1">Booking ID</th>
              <th className="border px-2 py-1">Amount</th>
              <th className="border px-2 py-1">Type</th>
              <th className="border px-2 py-1">Method</th>
              <th className="border px-2 py-1">Status</th>
              <th className="border px-2 py-1">Created At</th>
            </tr>
          </thead>
          <tbody>
            {booking.transactions.map((txn, index) => (
              <tr key={txn.id || index} className="text-sm">
                <td className="border px-2 py-1 text-center">{index + 1}</td>
                <td className="border px-2 py-1">{txn.formattedId}</td>
                <td className="border px-2 py-1">{txn.userId}</td>
                <td className="border px-2 py-1">{txn.expertId}</td>
                <td className="border px-2 py-1">{txn.bookingId}</td>
                <td className="border px-2 py-1">{txn.amount}</td>
                <td className="border px-2 py-1">{txn.type}</td>
                <td className="border px-2 py-1">{txn.paymentMethod}</td>
                <td className=" px-2 py-1">{txn.status}</td>
                <td className="border px-2 py-1">{formattedDate(txn.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    ) : (
      <div className="text-sm text-red-500">No transactions found.</div>
    )}
  </td>
</tr>






              </tbody>
            </table>
          </div>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default BookingInfo;
