// Next Imports
import { getServerSession } from "next-auth/next";
import Grid from "@mui/material/Grid2";

import { authOptions } from "@/libs/auth";
import pageApiHelper from "@/utils/pageApiHelper";

// Component Imports
import DetailUpdate from "@/views/apps/menus/menu-items/edit";

const getPageData = async (id, itemId) => {
  const session = await getServerSession(authOptions);

  if (!session?.accessToken) return null;

  try {
    const result = await pageApiHelper.get(
      `menus/${id}/menu-items/${itemId}`,
      {},
      session.accessToken,
    );

    if (result.success) return result.data;

    return null;
  } catch (error) {
    // console.error("Error fetching page section:", error);

    return null;
  }
};

export const metadata = {
  title: "Menu Update - AskValor",
};

const ExpertView = async ({ params }) => {
  const { id, itemId } = await params;

  const { data } = await getPageData(id, itemId);

  return <DetailUpdate data={data} />;
};

export default ExpertView;
