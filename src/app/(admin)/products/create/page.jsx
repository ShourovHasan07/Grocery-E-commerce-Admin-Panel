import { getServerSession } from "next-auth/next";

import { authOptions } from "@/libs/auth";
import pageApiHelper from "@/utils/pageApiHelper";

// Component Imports
import ProductCreate from "@/views/apps/products/create";

// expert category options data
const getCategoryData = async () => {
  // Vars
  const session = await getServerSession(authOptions);

  if (session?.accessToken) {
    try {
      // Fetching the categories data
      const result = await pageApiHelper.get(
        "experts/create-edit-options",
        {},
        session.accessToken,
      );

      if (result.success) {
        return result.data;
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
  title: "Experts - AskValor",
};

const ProductCreateApp = async () => {
  // Vars
  const result = await getCategoryData();

  const categories = result?.data?.categories || [];

  return <ProductCreate categoryData={categories} />;
};

export default ProductCreateApp;
