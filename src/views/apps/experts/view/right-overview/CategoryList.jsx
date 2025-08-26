// MUI Imports
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid2";

const CategoryList = ({ expertData }) => {
  return (
    <>
      <Card>
        <CardHeader title="About Me" className="pb-0" />

        <CardContent>
          <Grid size={{ xs: 12 }}>
            <div className="w-full">
              <p>{expertData.aboutMe}</p>
            </div>
          </Grid>
        </CardContent>

        <CardHeader title="Expert Categories" className="pb-1" />
        <CardContent>
          <Grid size={{ xs: 12 }}>
            <div className="w-full overflow-x-auto">
              <table className="w-full table-auto border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border px-4 py-2 text-start">ID</th>
                    <th className="border px-4 py-2 text-start">
                      Category Name
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {expertData.categories?.map((category, index) => (
                    <tr key={index}>
                      <td className="border px-4 py-2">{index + 1}</td>
                      <td className="border px-4 py-2">{category.name}</td>
                    </tr>
                  ))}
                  {(!expertData.categories ||
                    expertData.categories.length === 0) && (
                    <tr>
                      <td colSpan={2} className="border px-4 py-2 text-center">
                        No categories found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Grid>
        </CardContent>
      </Card>
    </>
  );
};

export default CategoryList;
