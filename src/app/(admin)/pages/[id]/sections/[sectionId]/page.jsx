// Next Imports
import { getServerSession } from "next-auth/next";
import Grid from "@mui/material/Grid2";

import { authOptions } from "@/libs/auth";
import pageApiHelper from "@/utils/pageApiHelper";

// Component Imports
import SectionsDetailUpdate from "@/views/apps/pages/section/SectionsDetailUpdate/list";

const getPageData = async (id, sectionId) => {
  const session = await getServerSession(authOptions);

  if (!session?.accessToken) return null;

  try {
    const result = await pageApiHelper.get(
      `pages/${id}/sections/${sectionId}`,
      {},
      session.accessToken
    );

    if (result.success) return result.data;

    return null;
  } catch (error) {
    console.error("Error fetching page section:", error);
    return null;
  }
};

export const metadata = {
  title: "Page Detail - AskValor",
};

const ExpertView = async ({ params }) => {
  const { id, sectionId } = await  params;

  const {data} = await getPageData(id, sectionId);

  

  return <SectionsDetailUpdate pageSection={data.page_section} />;
};

export default ExpertView;
