// MUI Imports
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid2";

const LanguageList = ({ expertData }) => {
  // console.log(expertData.languages)
  return (
    <>
      <Card>
        <CardHeader title="Expert Languages" className="pb-1" />

        <CardContent>
          <Grid size={{ xs: 12 }}>
            <div className="w-full overflow-x-auto">
              <table className="w-full table-auto border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border px-4 py-2 text-start">ID</th>
                    <th className="border px-4 py-2 text-start">Name</th>
                    <th className="border px-4 py-2 text-start">Level</th>
                  </tr>
                </thead>
                <tbody>
                  {expertData.languages?.map((language, index) => (
                    <tr key={index}>
                      <td className="border px-4 py-2">{index + 1}</td>
                      <td className="border px-4 py-2">{language.name}</td>
                      <td className="border px-4 py-2">
                        {language?.pivot?.level}
                      </td>
                    </tr>
                  ))}
                  {(!expertData.languages ||
                    expertData.languages.length === 0) && (
                    <tr>
                      <td colSpan={3} className="border px-4 py-2 text-center">
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

export default LanguageList;
