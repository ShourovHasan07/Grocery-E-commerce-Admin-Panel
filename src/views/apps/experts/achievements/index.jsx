// MUI Imports
import Grid from "@mui/material/Grid2";

import ExpertInfo from "./ExpertInfo";
import Form from "./Form";

const ExpertAchievement = ({ expertData, achievementData }) => {
  return (
    <Grid container>
      <Grid size={{ xs: 12 }}>
        <ExpertInfo expertData={expertData} />
        <Form achievementData={achievementData} />
      </Grid>
    </Grid >
  );
};

export default ExpertAchievement;
