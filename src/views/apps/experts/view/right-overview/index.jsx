"use client";

import Grid from "@mui/material/Grid2";

// Component Imports
import CategoryList from "./CategoryList";

const RightOverview = ({ categoryList }) => {
  return (
    <Grid container>
      <Grid size={{ xs: 12 }}>
        <CategoryList categoryData={categoryList} />
      </Grid>
    </Grid>
  );
};

export default RightOverview;
