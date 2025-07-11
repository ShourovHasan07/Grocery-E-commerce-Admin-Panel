// Component Imports
import { getServerSession } from 'next-auth';

import { authOptions } from "@/libs/auth";

import CategoryList from "@/views/apps/categories/list";


export const metadata = {
  title: "Categories - AskValor",
};

// const getCategoryData = async () => {

//   const session = await getServerSession(authOptions)

//   if (session.accessToken) {
//     try {
//       // Fetching the categories data
//       //const result = await apiHelper.get('categories', { pageSize: 200 }, session);

//      const url = `${process.env.NEXT_PUBLIC_APP_URL}/admin/categories?pageSize=200`;


//     const res = await fetch(url, {
//         method: "GET",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${session.accessToken}`,
//         },
//         cache: "no-store",
//       });

//       const result = await res.json();

//       if (res.ok && result.success) {
//         return result.data;
//       }

//       return null;
//     } catch (error) {
//       console.error("Fetching error:", error);
//       return null;
//     }
//   }

//   return null;
// };

const ListApp = async () => {

 // const dataCategories = await getCategoryData();

  // console.log(dataCategories);

  //return <CategoryList tData={dataCategories} />;
  return <CategoryList  />;
};

export default ListApp;
