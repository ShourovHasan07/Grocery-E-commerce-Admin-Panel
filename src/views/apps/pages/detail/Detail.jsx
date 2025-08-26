"use client";

// MUI Imports
import Image from "next/image";

import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid2";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";

import { activeStatusLabel, activeStatusColor } from "@/utils/helpers";
import { formattedDate } from "@/utils/formatters";
import NotFound from "@/components/NotFound";

const Detail = ({ page }) => {
  //if 404
  if (!page || Object.keys(page).length === 0) {
    return (
      <NotFound
        title="Client  Not Found"
        message="Sorry, we could not find the client you requested."
        buttonLabel="Back to Page"
        redirectPath="/pages"
      />
    );
  }

  return (
    <Card className="mb-4">
      <CardHeader title="Page  Info" />
      <CardContent>
        <Grid size={{ xs: 12 }}>
          <div className="w-full overflow-x-auto">
            <table className="w-full table-auto border-collapse">
              <tbody>
                <tr className="text-left">
                  <th className="border px-4 py-2 w-1/5">ID</th>
                  <td className="border px-4 py-2 w-4/5">{page.id}</td>
                </tr>
                <tr className="text-left">
                  <th className="border px-4 py-2 w-1/5">Title</th>
                  <td className="border px-4 py-2 w-4/5">{page.title}</td>
                </tr>
                <tr className="text-left">
                  <th className="border px-4 py-2 w-1/5">Url</th>
                  <td className="border px-4 py-2 w-4/5">{page.url}</td>
                </tr>
                <tr className="text-left">
                  <th className="border px-4 py-2 w-1/5">Image</th>
                  <td className="border px-4 py-2 w-4/5">
                    {page.image && <Image src={page.image} height={200} />}
                  </td>
                </tr>
                <tr className="text-left">
                  <th className="border px-4 py-2 w-1/5">Meta Title</th>
                  <td className="border px-4 py-2 w-4/5">{page.meta_title}</td>
                </tr>
                <tr className="text-left">
                  <th className="border px-4 py-2 w-1/5">Meta Keywords</th>
                  <td className="border px-4 py-2 w-4/5">
                    {page.meta_keywords}
                  </td>
                </tr>
                <tr className="text-left">
                  <th className="border px-4 py-2 w-1/5">Meta Description</th>
                  <td className="border px-4 py-2 w-4/5">
                    {page.meta_description}
                  </td>
                </tr>
                <tr className="text-left">
                  <th className="border px-4 py-2 w-1/5">Status</th>
                  <td className="border px-4 py-2 w-4/5">
                    <Chip
                      variant="tonal"
                      label={activeStatusLabel(page.status)}
                      size="small"
                      color={activeStatusColor(page.status)}
                      className="capitalize"
                    />
                  </td>
                </tr>

                <tr className="text-left">
                  <th className="border px-4 py-2 w-1/5">CreatedAt</th>
                  <td className="border px-4 py-2 w-4/5">
                    {formattedDate(page.createdAt)}
                  </td>
                </tr>
                <tr className="text-left">
                  <th className="border px-4 py-2 w-1/5">UpdatedAt</th>
                  <td className="border px-4 py-2 w-4/5">
                    {formattedDate(page.updatedAt)}
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

export default Detail;
