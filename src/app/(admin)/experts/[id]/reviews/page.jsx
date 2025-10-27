import { getServerSession } from "next-auth/next";

import { authOptions } from "@/libs/auth";
import pageApiHelper from "@/utils/pageApiHelper";

// Component Imports
import ExpertReview from "@/views/apps/experts/reviews";

const getExpertReview = async (id) => {
  // Vars
  const session = await getServerSession(authOptions);

  if (session?.accessToken) {
    try {
      // Fetching the categories data
      const result = await pageApiHelper.get(
        `experts/${id}/reviews`,
        { pageSize: 200 },
        session.accessToken,
      );

      if (result.success) {
        return result.data;
      }

      return null;
    } catch (error) {
      console.error('Error fetching categories:', error);

      return null;
    }
  }

  return null;
};

export const metadata = {
  title: "Expert Review - AskValor",
};

const ExpertReviewApp = async ({ params }) => {
  // Vars
  const { id } = await params;
  const { data } = await getExpertReview(id);

  const reviews = data?.reviews || [];
  const expert = data?.expert || [];

  return (
    <ExpertReview expert={expert} reviews={reviews} />
  );
};

export default ExpertReviewApp;
