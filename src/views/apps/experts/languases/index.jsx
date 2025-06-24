// MUI Imports

import Grid from "@mui/material/Grid2";

import ExpertInfo from "./ExpertInfo";
import FormList from "./FormList";

const ExpertLanguage = ({ expertData, languageData }) => {
  console.log(expertData)
  return (
    <Grid container>      
      <Grid size={{ xs: 12 }}>
        <ExpertInfo expertData={expertData} />
        <FormList languageData={languageData} langulageList={expertData?.languages || []} />
      </Grid>
    </Grid>
  );
};

export default ExpertLanguage; 
