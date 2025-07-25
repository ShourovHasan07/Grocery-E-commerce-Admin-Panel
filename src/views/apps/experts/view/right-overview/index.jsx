"use client";

import Grid from "@mui/material/Grid2";

import CategoryList from "./CategoryList";
import LanguageList from "./LanguageList";
import AchievementList from "./AchievementList";
import TimeSlots from "./TimeSlots";

const RightOverview = ({ expert }) => {
  return (
    <Grid container>
      <Grid size={{ xs: 12 }}>
        <Grid mb={{ xs: 3 }}>
          <CategoryList expertData={expert} />
        </Grid>

        <Grid mb={{ xs: 3 }}>
          <LanguageList expertData={expert} />
        </Grid>

        <Grid mb={{ xs: 3 }}>
          <AchievementList expertData={expert} />
        </Grid>

        <Grid>
          <TimeSlots expertData={expert} />
        </Grid>
      </Grid>
    </Grid>
  );
};

export default RightOverview;
