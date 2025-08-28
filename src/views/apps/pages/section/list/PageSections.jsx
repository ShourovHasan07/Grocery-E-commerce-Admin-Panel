"use client";

// MUI Imports
import Link from "next/link";

import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid2";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Button from "@mui/material/Button";

import { activeStatusLabel, activeStatusColor } from "@/utils/helpers";

const PageSections = ({ page }) => {
  return (
    <Card className="mb-4">
      <CardHeader title="Page Info" />
      <CardContent>
        <Grid size={{ xs: 12 }}>
          <div className="w-full overflow-x-auto">
            <table className="w-full table-auto   border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border px-4 py-2">ID</th>
                  <th className="border px-4 py-2">Banner Title</th>
                  <th className="border px-4 py-2">Title</th>
                  <th className="border px-4 py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border text-center align-middle px-4 py-2">
                    {page.id}
                  </td>
                  <td className="border text-center align-middle px-4 py-2">
                    {page.title}
                  </td>
                  <td className="border text-center align-middle px-4 py-2">
                    {page.detail}
                  </td>
                  <td className="border text-center align-middle px-4 py-2">
                    <Chip
                      variant="tonal"
                      label={activeStatusLabel(page.status)}
                      size="small"
                      color={activeStatusColor(page.status)}
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

export default PageSections;
