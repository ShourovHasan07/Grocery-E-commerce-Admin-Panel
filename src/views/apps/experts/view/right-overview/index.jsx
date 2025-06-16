"use client";

import Grid from "@mui/material/Grid2";

// Component Imports
import CategoryList from "./CategoryList";

const RightOverview = ({ expert }) => {
  return (
    <Grid container>
      <Grid size={{ xs: 12 }}>
        <CategoryList expertData={expert} />
      </Grid>
    </Grid>
  );
};

export default RightOverview;
