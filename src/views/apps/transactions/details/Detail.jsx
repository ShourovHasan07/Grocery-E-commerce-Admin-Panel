"use client";

// MUI Imports
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid2";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";

import { getCurrency, transactionStatusLabel, transactionStatusColor } from "@/utils/helpers";
import { formattedDate } from "@/utils/formatters";
import NotFound from "@/components/NotFound";
import Link from "@/components/Link";

const TransactionInfo = ({ transaction }) => {
  // if 404
  const isTransactionInvalid =
    !transaction ||
    typeof transaction !== "object" ||
    transaction === null ||
    Array.isArray(transaction) ||
    Object.keys(transaction).length === 0;

  if (isTransactionInvalid) {
    return (
      <NotFound
        title="Transaction Not Found"
        message="Sorry, we could not find the transaction you requested."
        buttonLabel="Back to transaction List"
        redirectPath="/transactions"
      />
    );
  }

  return (
    <Card className="mb-4">
      <CardHeader title="Transaction Info" />
      <CardContent>
        <Grid size={{ xs: 12 }}>
          <div className="w-full overflow-x-auto">
            <table className="w-full table-auto border-collapse">
              <tbody>
                <tr className="text-left">
                  <th className="border px-4 py-2 w-1/5">ID</th>
                  <td className="border px-4 py-2 w-4/5">{transaction.id}</td>
                </tr>
                <tr className="text-left">
                  <th className="border px-4 py-2 w-1/5">Status</th>
                  <td className="border px-4 py-2 w-4/5">
                    <Chip
                      variant="tonal"
                      label={transactionStatusLabel(transaction.status)}
                      size="small"
                      color={transactionStatusColor(transaction.status)}
                      className="capitalize"
                    />
                  </td>
                </tr>
                <tr className="text-left">
                  <th className="border px-4 py-2 w-1/5">Amount</th>
                  <td className="border px-4 py-2 w-4/5">{getCurrency} {transaction.amount}</td>
                </tr>
                <tr className="text-left">
                  <th className="border px-4 py-2 w-1/5">Transaction ID</th>
                  <td className="border px-4 py-2 w-4/5">{transaction.transactionId}</td>
                </tr>
                <tr className="text-left">
                  <th className="border px-4 py-2 w-1/5">Payment Method</th>
                  <td className="border px-4 py-2 w-4/5">
                    {transaction.paymentMethod && <Chip
                      variant="tonal"
                      label={transaction.paymentMethod}
                      size="small"
                      color='primary'
                      className="capitalize"
                    />
                    }
                  </td>
                </tr>
                <tr className="text-left">
                  <th className="border px-4 py-2 w-1/5 align-top">
                    Client Name
                  </th>
                  <td className="border px-4 py-2 w-4/5">
                    <Link
                      className="text-info"
                      href={`/users/${transaction.user.id}`}
                    >
                      {transaction.user.name}
                    </Link>
                  </td>
                </tr>
                <tr className="text-left">
                  <th className="border px-4 py-2 w-1/5 align-top">
                    Expert Name
                  </th>
                  <td className="border px-4 py-2 w-4/5">
                    <Link
                      className="text-info"
                      href={`/experts/${transaction.expert.id}`}
                    >
                      {transaction.expert.name}
                    </Link>
                  </td>
                </tr>

                <tr className="text-left">
                  <th className="border px-4 py-2 w-1/5">Booking Time</th>
                  <td className="border px-4 py-2 w-4/5">
                    {transaction.booking.timeMin} mins
                  </td>
                </tr>

                <tr className="text-left">
                  <th className="border px-4 py-2 w-1/5">CreatedAt</th>
                  <td className="border px-4 py-2 w-4/5">
                    {formattedDate(transaction.createdAt)}
                  </td>
                </tr>
                <tr className="text-left">
                  <th className="border px-4 py-2 w-1/5">UpdatedAt</th>
                  <td className="border px-4 py-2 w-4/5">
                    {formattedDate(transaction.updatedAt)}
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

export default TransactionInfo;
