// Component Imports
import { getServerSession } from "next-auth";

import { authOptions } from "@/libs/auth";

import ContactList from "@/views/apps/contacts/list";
import pageApiHelper from "@/utils/pageApiHelper";

export const metadata = {
  title: "Contacts - AskValor",
};

const getData = async () => {
  const session = await getServerSession(authOptions);

  if (session?.accessToken) {
    try {
      // Fetching the contacts data
      const result = await pageApiHelper.get(
        "contacts",
        { pageSize: 200 },
        session.accessToken,
      );

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
  const { data } = await getData();

  return <ContactList tData={data} />;
};

export default ListApp;
