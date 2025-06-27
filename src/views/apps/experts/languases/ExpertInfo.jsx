"use client";

// MUI Imports
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid2";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";

import { activeStatusLabel, activeStatusColor } from "@/utils/helpers";

const ExpertInfo = ({ expertData }) => {
  // console.log('expertData: ', expertData);

  return (
    <Card className="mb-4">
      <CardHeader title="Expert Info" />
      <CardContent>
        <Grid size={{ xs: 12 }}>
          <div className="w-full overflow-x-auto">
            <table className="w-full table-auto border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border px-4 py-2">ID</th>
                  <th className="border px-4 py-2">Name</th>
                  <th className="border px-4 py-2">Email</th>
                  <th className="border px-4 py-2">Phone</th>
                  <th className="border px-4 py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border px-4 py-2">{expertData.id}</td>
                  <td className="border px-4 py-2">{expertData.name}</td>
                  <td className="border px-4 py-2">{expertData.email}</td>
                  <td className="border px-4 py-2">{expertData.phone}</td>
                  <td className="border px-4 py-2">
                    <Chip
                      variant="tonal"
                      label={activeStatusLabel(expertData.status)}
                      size="small"
                      color={activeStatusColor(expertData.status)}
                      className="capitalize"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default ExpertInfo;
