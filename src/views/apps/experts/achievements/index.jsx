// MUI Imports
import Grid from "@mui/material/Grid2";

import ExpertInfo from "../expertInfo/ExpertInfo";
import FormList from "./FormList";

const ExpertAchievement = ({ expertData, achievementData }) => {
  return (
    <Grid container>
      <Grid size={{ xs: 12 }}>
        <ExpertInfo expertData={expertData} />
        <FormList achievementData={achievementData} achievementList={expertData?.achievements || []} />
      </Grid>
    </Grid>
  );
};

export default ExpertAchievement;
