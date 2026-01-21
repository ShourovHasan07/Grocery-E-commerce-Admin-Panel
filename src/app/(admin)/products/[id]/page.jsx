import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/auth";

// Component
import Productdetails from "@/views/apps/products/productsDetails by ID/list/index";

/* ---------------- FETCH PRODUCT ---------------- */
const getProductData = async (id) => {
  const session = await getServerSession(authOptions);

  if (!session?.accessToken) return null;

  try {
    const res = await fetch(`http://localhost:4000/products/${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
      },
      cache: "no-store", // important for edit page
    });

    if (!res.ok) return null;

    const result = await res.json();
    return result?.data || result;
  } catch (error) {
    console.error("Fetch product error:", error);
    return null;
  }
};

/* ---------------- METADATA ---------------- */
export const metadata = {
  title: "getProduct data by id  - Admin",
};

/* ---------------- PAGE ---------------- */
const ProductsDatabyID = async ({ params }) => {
  const { id } = params;

  const editProduct = await getProductData(id);

  if (!editProduct) {
    return <div className="p-6">Product not found</div>;
  }

  return <Productdetails  editProduct={editProduct} />;
};

export default ProductsDatabyID;
