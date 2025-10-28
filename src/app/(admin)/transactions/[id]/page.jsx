// Next Imports
import { getServerSession } from "next-auth/next";

import { authOptions } from "@/libs/auth";

import pageApiHelper from "@/utils/pageApiHelper";

import TransactionInfo from "@/views/apps/transactions/details/Detail";
import NotFound from "@/components/NotFound";

const getTransactionData = async (id) => {
  // Vars
  const session = await getServerSession(authOptions);

  if (session.accessToken) {
    try {
      // Fetching the transaction data
      const result = await pageApiHelper.get(
        `transactions/${id}`,
        {},
        session.accessToken,
      );

      //console.log("Transactions Data:", result);

      if (result.success && result?.data?.data) {
        return result.data.data;
      }

      return null;
    } catch (error) {
      return null;
    }
  }

  return null;
};

export const metadata = {
  title: "Transaction Detail's - AskValor",
};

const DetailApp = async ({ params }) => {
  const { id } = await params;
  const result = await getTransactionData(id);

  if (!result || !result.transaction || !result.transaction.id) {
    return (
      <NotFound
        title="Transaction Not Found"
        message="Sorry, we could not find the transaction you requested."
        buttonLabel="Back to transaction List"
        redirectPath="/transactions"
      />
    );
  }

  return <TransactionInfo transaction={result.transaction} />;
};

export default DetailApp;
