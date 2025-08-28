"use client";

// React Imports
import Link from "next/link";

// MUI Imports
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid2";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import IconButton from "@mui/material/IconButton";

// Components Imports
import { Chip } from "@mui/material";

import { formattedDate } from "@/utils/formatters";
import { activeStatusColor, activeStatusLabel } from "@/utils/helpers";

const FormList = ({ page }) => {
  return (
    <Card className="mb-4">
      <CardHeader title="Section List" />

      <CardContent>
        <Grid size={{ xs: 12 }}>
          <div className="w-full overflow-x-auto">
            <table className="w-full table-auto border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border px-4 py-2">Action</th>
                  <th className="border px-4 py-2">ID</th>
                  <th className="border px-4 py-2">Image</th>
                  <th className="border px-4 py-2">Pre Title</th>
                  <th className="border px-4 py-2">Title</th>
                  <th className="border px-4 py-2">Status</th>
                  <th className="border px-4 py-2">Created At</th>
                  <th className="border px-4 py-2">Updated At</th>
                </tr>
              </thead>
              <tbody>
                {page.page_sections &&
                  page.page_sections.map((section, index) => (
                    <tr key={index}>
                      <td className="border px-4 py-2 text-center">
                        <IconButton>
                          <Link
                            href={`/pages/${page.id}/sections/${section.id}`}
                            className="flex"
                          >
                            <i className="tabler-edit text-primary" />
                          </Link>
                        </IconButton>
                      </td>
                      <td className="border px-4 py-2">{section.id}</td>
                      <td className="border px-4 py-2 text-center">
                        {section.image && (
                          <img
                            src={section.image}
                            alt={section.title || "Section image"}
                            className="w-20 object-cover rounded-sm mx-auto"
                          />
                        )}
                      </td>
                      <td className="border px-4 py-2">{section.preTitle}</td>
                      <td className="border px-4 py-2">{section.title}</td>
                      <td className="border px-4 py-2 text-center">
                        <Chip
                          variant="tonal"
                          label={activeStatusLabel(section.status)}
                          size="small"
                          color={activeStatusColor(section.status)}
                          className="capitalize"
                        />
                      </td>
                      <td className="border px-4 py-2">
                        {formattedDate(section.createdAt)}
                      </td>
                      <td className="border px-4 py-2">
                        {formattedDate(section.updatedAt)}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default FormList;
