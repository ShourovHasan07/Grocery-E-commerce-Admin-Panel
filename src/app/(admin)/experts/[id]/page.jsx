// Next Imports
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/auth";
import apiHelper from "@/utils/apiHelper";

// MUI Imports
import Grid from "@mui/material/Grid2";

// Component Imports
import LeftOverview from "@/views/apps/experts/view/left-overview";
import RightOverview from "@/views/apps/experts/view/right-overview";

const getExpertData = async (id) => {
  // Vars
  const session = await getServerSession(authOptions)

  if (session.accessToken) {
    try {
      // Fetching the categories data
      const result = await apiHelper.get(`experts/${id}`, session);

      if (result.success) {
        return result.data;
      }

      return null;
    } catch (error) {
      // console.error('Error fetching categories:', error);

      return null;
    }
  }

  return null;
}
const ExpertView = async ({ params }) => {
  // Vars
  const { id } = await params

  const { expert } = await getExpertData(id);

  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12, lg: 4, md: 5 }}>
        <LeftOverview expertData={expert} />
      </Grid>
      <Grid size={{ xs: 12, lg: 8, md: 7 }}>
        <RightOverview categoryList={expert?.categories || []} />
      </Grid>
    </Grid>
  );
};

export default ExpertView;
