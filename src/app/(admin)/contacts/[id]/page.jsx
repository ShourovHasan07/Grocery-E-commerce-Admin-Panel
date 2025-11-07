// Next Imports
import { getServerSession } from "next-auth/next";

import { authOptions } from "@/libs/auth";

import pageApiHelper from "@/utils/pageApiHelper";

import ContactDetail from "@/views/apps/contacts/details";

const getContactData = async (id) => {
  // Vars
  const session = await getServerSession(authOptions);

  if (session.accessToken) {
    try {
      // Fetching the categories data
      const result = await pageApiHelper.get(
        `contacts/${id}`,
        {},
        session.accessToken,
      );

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
  title: "Contact Detail's - AskValor",
};

const UserApp = async ({ params }) => {
  const { id } = await params;
  const res = await getContactData(id);
  const contact = res?.contact || [];

  return <ContactDetail contact={contact} />;
};

export default UserApp;
