// Component Imports
import CategoryList from "@/views/apps/categories/list";

/**
 * ! If you need data using an API call, uncomment the below API code, update the `process.env.API_URL` variable in the
 * ! `.env` file found at root of your project and also update the API endpoints like `/apps/user-list` in below example.
 * ! Also, remove the above server action import and the action itself from the `src/app/server/actions.ts` file to clean up unused code
 * ! because we've used the server action for getting our static data.
 */
const getCategoryData = async () => {
  // Vars
  const res = await fetch(`${process.env.ADMIN_API_BASE_URL}/categories?pageSize=200`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${process.env.BEARER_TOKEN}`,
      'Content-Type': 'application/json'
    }
  })

  if (!res.ok) {
    throw new Error('Failed to fetch Category Data')
  }

  return res.json()
}

const ListApp = async () => {
  // Vars
  const dataCategories = await getCategoryData();

  console.log(dataCategories);

  return <CategoryList tData={dataCategories} />;
};

export default ListApp;
