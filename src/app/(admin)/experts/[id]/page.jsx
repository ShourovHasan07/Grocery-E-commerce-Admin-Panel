// Next Imports
import { getServerSession } from "next-auth/next";

import Grid from "@mui/material/Grid2";

import { authOptions } from "@/libs/auth";


// third party apihelper 
import pageApiHelper from "@/utils/pageApiHelper";

// Component Imports
import LeftOverview from "@/views/apps/experts/view/left-overview";
import RightOverview from "@/views/apps/experts/view/right-overview";



const getExpertData = async (id) => {
  // Vars
  const session = await getServerSession(authOptions)

  if (session.accessToken) {
    try {
      // Fetching the categories data
      const result = await pageApiHelper.get(`experts/${id}`,  { pageSize: 200 }, session.accessToken);
   
      

     

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

export const metadata = {
  title: "Expert Detail - AskValor",
};

const ExpertView = async ({ params }) => {
  // Vars
  const { id } = await  params 


  const {data }= await getExpertData(id);

  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12, lg: 4, md: 5 }}>
        <LeftOverview expertData={data.expert} />
      </Grid>
      <Grid size={{ xs: 12, lg: 8, md: 7 }}>
        <RightOverview expert={data.expert} />
      </Grid>
    </Grid>
  );
};

export default ExpertView;
