// MUI Imports
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid2";


const LanguagesList = ({ expertData }) => {

  console.log("expert data :",expertData)


  return (
    <>
      <Card>
        <CardHeader
          title=""
          className="pb-0"
        />

        <CardContent>
          <Grid size={{ xs: 12 }}>
            <div className="w-full">
              <p></p>
            </div>
          </Grid>
        </CardContent>

        <CardHeader
          title="Expert languages"
          className="pb-0"
        />
        <CardContent>
          <Grid size={{ xs: 12 }}>
            <div className="w-full overflow-x-auto">
              <table className="w-full table-auto border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border px-4 py-2">ID</th>
                    <th className="border px-4 py-2">languages Name</th>
                  </tr>
                </thead>
                <tbody>
                  {expertData.languages?.map((language, index) => (
                    <tr key={index}>
                      <td className="border px-4 py-2">{index + 1}</td>
                      <td className="border px-4 py-2">{language.name}</td>
                    </tr>
                  ))}
                  {(!expertData.languages || expertData.languages.length === 0) && (
                    <tr>
                      <td colSpan={2} className="border px-4 py-2 text-center">
                        No languages found
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

export default LanguagesList;
