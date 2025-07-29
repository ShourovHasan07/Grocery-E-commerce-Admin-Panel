"use client";

// MUI Imports
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid2";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";

import { activeStatusLabel, activeStatusColor } from "@/utils/helpers";
import { formattedDate } from "@/utils/formatters";

const ExpertInfo = ({ user }) => {

  return (
    <Card className="mb-4">
      <CardHeader title="Expert Info" />
      <CardContent>
        <Grid size={{ xs: 12 }}>
          <div className="w-full overflow-x-auto">
            <table className="w-full table-auto border-collapse">
              <tbody>
                <tr className="text-left">
                  <th className="border px-4 py-2 w-1/5">ID</th>
                  <td className="border px-4 py-2 w-4/5">{user.id}</td>
                </tr>
                <tr className="text-left">
                  <th className="border px-4 py-2 w-1/5">Email</th>
                  <td className="border px-4 py-2 w-4/5">{user.email}</td>
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
