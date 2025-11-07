// Component Imports
import { getServerSession } from "next-auth";

import { authOptions } from "@/libs/auth";

import SubjectList from "@/views/apps/contacts/subjects";
import pageApiHelper from "@/utils/pageApiHelper";

export const metadata = {
  title: "Contact Subjects - AskValor",
};

const getData = async () => {
  const session = await getServerSession(authOptions);

  if (session?.accessToken) {
    try {
      // Fetching the languages data
      const result = await pageApiHelper.get(
        "contact-subjects",
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

  return <SubjectList tData={data} />;
};

export default ListApp;
