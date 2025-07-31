"use client";

// MUI Imports
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid2";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";


import { bookingStatusLabel, bookingStatusColor } from "@/utils/helpers";
import { formattedDate } from "@/utils/formatters";
import NotFound from "@/components/NotFound";
import Link from "@/components/Link";


const BookingInfo = ({ booking }) => {

  // if 404
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
                  <th className="border px-4 py-2 w-1/5 align-top">Client Name</th>
                  <td className="border px-4 py-2 w-4/5">
                    <Link className="text-info" href={`/users/${booking.user.id}`}>
                      {booking.user.name}
                    </Link>
                  </td>
                </tr>
                <tr className="text-left">
                  <th className="border px-4 py-2 w-1/5 align-top">Expert Name</th>
                  <td className="border px-4 py-2 w-4/5">
                    <Link className="text-info" href={`/experts/${booking.expert.id}`}>
                      {booking.expert.name}
                    </Link>
                  </td>
                </tr>
                <tr className="text-left">
                  <th className="border px-4 py-2 w-1/5">Booking Date</th>
                  <td className="border px-4 py-2 w-4/5">{booking.bookingDate}</td>
                </tr>
                <tr className="text-left">
                  <th className="border px-4 py-2 w-1/5">Start At</th>
                  <td className="border px-4 py-2 w-4/5">{formattedDate(booking.startAt)}</td>
                </tr>
                <tr className="text-left">
                  <th className="border px-4 py-2 w-1/5">End At</th>
                  <td className="border px-4 py-2 w-4/5">{formattedDate(booking.endAt)}</td>
                </tr>
                <tr className="text-left">
                  <th className="border px-4 py-2 w-1/5">Booking Time</th>
                  <td className="border px-4 py-2 w-4/5">{booking.timeMin} mins</td>
                </tr>
                <tr className="text-left">
                  <th className="border px-4 py-2 w-1/5">Fee</th>
                  <td className="border px-4 py-2 w-4/5">{booking.fee}</td>
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
                      label={bookingStatusLabel(booking.status)}
                      size="small"
                      color={bookingStatusColor(booking.status)}
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
                  <th className="border px-4 py-2 w-1/5 align-top">Transactions</th>
                  <td className="border px-4 py-2 w-4/5">
                    {booking.transactions?.length > 0 ? (
                      <div className="overflow-x-auto">
                        <table className="table-auto w-full border-collapse border">
                          <thead>
                            <tr className="bg-gray-100 text-sm">
                              <th className="border px-2 py-1">ID</th>
                              <th className="border px-2 py-1">Transaction ID</th>
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
                                <td className="border px-2 py-1">{txn.id}</td>
                                <td className="border px-2 py-1">{txn.transactionId}</td>
                                <td className="border px-2 py-1">{txn.amount}</td>
                                <td className="border px-2 py-1 capitalize">{txn.type}</td>
                                <td className="border px-2 py-1 capitalize">{txn.paymentMethod}</td>
                                <td className=" px-2 py-1">{txn.status}</td>
                                <td className="border px-2 py-1">{formattedDate(txn.createdAt)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="text-sm text-red-500">No transaction found.</div>
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
