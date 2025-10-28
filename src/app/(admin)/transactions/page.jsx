// Component Imports
import { getServerSession } from "next-auth";

import { authOptions } from "@/libs/auth";

import pageApiHelper from "@/utils/pageApiHelper";
import TransactionsList from "@/views/apps/transactions/list";

export const metadata = {
  title: "Transactions - AskValor",
};

const getData = async () => {
  const session = await getServerSession(authOptions);

  if (session?.accessToken) {
    try {
      // Fetching the languages data
      const result = await pageApiHelper.get(
        "transactions",
        { pageSize: 200 },
        session.accessToken,
      );

      //console.log("Transactions Data:", result);
      if (result.success) {
        return result.data;
      }

      return null;
    } catch (error) {
      return null;
    }
  }

  return null;
};

const ListApp = async () => {
  const result = await getData();
  const transactionsData = result.data;

  return <TransactionsList tData={transactionsData} />;
};

export default ListApp;
