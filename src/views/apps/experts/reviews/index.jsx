"use client";

// React Imports
import { useState } from "react";

// MUI Imports
import Grid from "@mui/material/Grid2";

import ExpertInfo from "../expertInfo/ExpertInfo";
import FormList from "./FormList";

const ExpertReview = ({ expert, reviews }) => {
  const [expertData, setExpertData] = useState(expert);

  return (
    <Grid container>
      <Grid size={{ xs: 12 }}>
        <ExpertInfo expert={expertData} />
        <FormList
          reviewsList={reviews}
          setExpertData={setExpertData}
        />
      </Grid>
    </Grid>
  );
};

export default ExpertReview;
