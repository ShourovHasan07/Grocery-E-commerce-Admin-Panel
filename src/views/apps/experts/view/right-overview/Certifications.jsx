// MUI Imports
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid2";

const Certifications = ({ expertData }) => {
  const handleDownload = (certification) => {
    if (
      certification.certificationFileUrl &&
      certification.certificationFileUrl !== "null"
    ) {
      const link = document.createElement("a");

      link.href = certification.certificationFileUrl;
      link.download = certification.certificationFile;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <>
      <Card>
        <CardHeader title="Expert Certifications" className="pb-1" />

        <CardContent>
          <Grid size={{ xs: 12 }}>
            <div className="w-full overflow-x-auto">
              <table className="w-full table-auto border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border px-4 py-2">ID</th>
                    <th className="border px-4 py-2">Certification File</th>
                    <th className="border px-4 py-2">Institute</th>
                    <th className="border px-4 py-2">Degree</th>
                    <th className="border px-4 py-2">Year</th>
                  </tr>
                </thead>
                <tbody>
                  {expertData.certifications?.map((certification, index) => (
                    <tr key={index}>
                      <td className="border px-4 py-2 text-start">
                        {index + 1}
                      </td>
                      <td className="border px-4 py-2 text-blue-700">
                        {certification.certificateFileName &&
                          certification.certificateFileName !== "null" && (
                            <span
                              onClick={(e) => {
                                e.preventDefault();
                                handleDownload(certification);
                              }}
                            >
                              {certification.certificateFileName}
                            </span>
                          )}
                      </td>
                      <td className="border px-4 py-2">
                        {certification.college || ""}
                      </td>
                      <td className="border px-4 py-2">
                        {certification.degree || ""}
                      </td>
                      <td className="border px-4 py-2 text-center">
                        {certification.graduationYear || ""}
                      </td>
                    </tr>
                  ))}
                  {(!expertData.certifications ||
                    expertData.certifications.length === 0) && (
                    <tr>
                      <td colSpan={5} className="border px-4 py-2 text-center">
                        No certifications found
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

export default Certifications;
