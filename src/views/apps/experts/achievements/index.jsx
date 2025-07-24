// MUI Imports
import Grid from "@mui/material/Grid2";

import ExpertInfo from "../expertInfo/ExpertInfo";
import FormList from "./FormList";

const ExpertAchievement = ({ expert, achievementDropdown }) => {

  const achievementList = expert.achievements || []

  return (
    <Grid container>
      <Grid size={{ xs: 12 }}>
        <ExpertInfo expert={expert} />
        <FormList achievementDropdown={achievementDropdown} achievementList={achievementList} />
      </Grid>
    </Grid>
  );
};

export default ExpertAchievement;
