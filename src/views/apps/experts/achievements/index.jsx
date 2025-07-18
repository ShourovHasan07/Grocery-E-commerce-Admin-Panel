// MUI Imports
import Grid from "@mui/material/Grid2";

import ExpertInfo from "./ExpertInfo";
import FormList from "./FormList";

const ExpertAchievement = ({ expertData, achievementData }) => {
   //console.log("expertdata:", expertData);
   //console.log("Achievement data:", achievementData);

  return (
    <Grid container>
      <Grid size={{ xs: 12 }}>
        <ExpertInfo expertData={expertData} />
        <FormList achievementData={achievementData} achievementList={expertData?.data?.expert?.achievements || []} />
      </Grid>
    </Grid>
  );
};

export default ExpertAchievement;
