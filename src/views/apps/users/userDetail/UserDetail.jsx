"use client";

// MUI Imports
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid2";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import { useRouter } from "next/navigation";


import { activeStatusLabel, activeStatusColor } from "@/utils/helpers";
import { formattedDate } from "@/utils/formatters";
import NotFound from "@/components/Not-Found -component/NotFound";



const UserInfo = ({ user }) => {

 

  // if user data is invalid
  if (!user || Object.keys(user).length === 0) {
    return (
      <NotFound
        title="Client  Not Found"
        message="Sorry, we could not find the booking you requested."
        buttonLabel="Back to Client List"
        redirectPath="/users"
      />
    );
  }

  
  return (
    <Card className="mb-4">
      <CardHeader title="Client  Info" />
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
                  <th className="border px-4 py-2 w-1/5">Name</th>
                  <td className="border px-4 py-2 w-4/5">{user.name}</td>
                </tr>
                <tr className="text-left">
                  <th className="border px-4 py-2 w-1/5">Email</th>
                  <td className="border px-4 py-2 w-4/5">{user.email}</td>
                </tr>
                <tr className="text-left">
                  <th className="border px-4 py-2 w-1/5">Phone</th>
                  <td className="border px-4 py-2 w-4/5">{user.phone}</td>
                </tr>
                <tr className="text-left">
                  <th className="border px-4 py-2 w-1/5">Status</th>
                  <td className="border px-4 py-2 w-4/5">
                    <Chip
                      variant="tonal"
                      label={activeStatusLabel(user.status)}
                      size="small"
                      color={activeStatusColor(user.status)}
                      className="capitalize"
                    />
                  </td>
                </tr>

                <tr className="text-left">
                  <th className="border px-4 py-2 w-1/5">CreatedAt</th>
                  <td className="border px-4 py-2 w-4/5">{formattedDate(user.createdAt)}</td>
                </tr>
                <tr className="text-left">
                  <th className="border px-4 py-2 w-1/5">UpdatedAt</th>
                  <td className="border px-4 py-2 w-4/5">{formattedDate(user.updatedAt)}</td>
                </tr>

              </tbody>
            </table>
          </div>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default UserInfo;
