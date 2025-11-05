"use client";

// MUI Imports
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid2";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";

import { activeStatusLabel, activeStatusColor } from "@/utils/helpers";
import { formattedDate } from "@/utils/formatters";

const MenuInfo = ({ menu }) => {
  return (
    <Card className="mb-4">
      <CardHeader title="Menu Info" />
      <CardContent>
        <Grid size={{ xs: 12 }}>
          <div className="w-full overflow-x-auto">
            <table className="w-full table-auto border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border px-4 py-2">ID</th>
                  <th className="border px-4 py-2">Title</th>
                  <th className="border px-4 py-2">Status</th>
                  <th className="border px-4 py-2">Created At</th>
                  <th className="border px-4 py-2">Updated At</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border px-4 py-2">{menu.id}</td>
                  <td className="border px-4 py-2">{menu.title}</td>
                  <td className="border px-4 py-2 text-center">
                    <Chip
                      variant="tonal"
                      label={activeStatusLabel(menu.status)}
                      size="small"
                      color={activeStatusColor(menu.status)}
                      className="capitalize"
                    />
                  </td>
                  <td className="border px-4 py-2">
                    {formattedDate(menu.createdAt)}
                  </td>
                  <td className="border px-4 py-2">
                    {formattedDate(menu.updatedAt)}
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

export default MenuInfo;
