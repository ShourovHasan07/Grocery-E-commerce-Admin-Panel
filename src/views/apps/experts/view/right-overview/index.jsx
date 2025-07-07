"use client";

import Grid from "@mui/material/Grid2";

// Component Imports
import { Box } from "@mui/material";

import CategoryList from "./CategoryList";
import LanguageList from "./LanguagesList";
import TimeSlots from "./TimeSlots";

const RightOverview = ({ expert }) => {
  return (
    <Grid container>
  <Grid item xs={12}>  {/* Add 'item' prop here */}
    <CategoryList expertData={expert} />
    
    {/* Option A: Wrap in Box */}
    <Box mt={3}>  {/* This will definitely work */}
      <LanguageList expertData={expert} />
    </Box>
    <Box mt={3}> 
      <TimeSlots expertData={expert} />
    </Box>

   
  </Grid>
</Grid>
  );
};

export default RightOverview;
