// MUI Imports

import Grid from "@mui/material/Grid2";

import ExpertInfo from "../expertInfo/ExpertInfo";
import FormList from "./FormList";

const ExpertLanguage = ({ expertData, languageData }) => {

  return (
    <Grid container>
      <Grid size={{ xs: 12 }}>
        <ExpertInfo expertData={expertData} />
        <FormList languageData={languageData} languageList={expertData?.data?.expert?.languages || []} />
      </Grid>
    </Grid>
  );
};

export default ExpertLanguage;
