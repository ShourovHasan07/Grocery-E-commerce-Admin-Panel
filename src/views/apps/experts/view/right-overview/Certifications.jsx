// MUI Imports
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid2";







const Certifications = ({ expertData }) => {

   

    const handleDownload = (certification) => {
        if (certification.certificationFileUrl && certification.certificationFileUrl !== "null") {
            const link = document.createElement("a");
            link.href = certification.certificationFileUrl;
            link.download = certification.certificationFile;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };





    //if here need img  avator,   follow acivementlist.jsx


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
                                        <th className="border px-4 py-2 text-start">ID</th>
                                        <th className="border px-4 py-2">CertificationFileName </th>

                                        <th className="border px-4 py-2">Institute </th>
                                        <th className="border px-4 py-2">Degree</th>
                                        <th className="border px-4 py-2">GraduationYear</th>

                                    </tr>
                                </thead>
                                <tbody>
                                    {expertData.certifications?.map((certification, index) => (
                                        <tr key={index}>
                                            <td className="border px-4 py-2 text-start">{index + 1}</td>




                                            <td className="border px-4 py-2 text-center text-blue-700">
                                                {certification.certificateFileName &&
                                                    certification.certificateFileName !== "null" ? (
                                                    <a
                                                        href="#"
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            handleDownload(certification);
                                                        }}
                                                    >
                                                        {certification.certificateFileName}
                                                    </a>
                                                ) : (
                                                    ""
                                                )}
                                            </td>

                                            <td className="border px-4 py-2 text-center">{certification.college || ""}</td>
                                            <td className="border px-4 py-2 text-center">{certification.degree || ""}</td>
                                            <td className="border px-4 py-2 text-center">{certification.graduationYear || ""}</td>
                                        </tr>
                                    ))}
                                    {(!expertData.certifications || expertData.certifications.length === 0) && (
                                        <tr>
                                            <td colSpan={4} className="border px-4 py-2 text-center">
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
