// MUI Imports

import Grid from "@mui/material/Grid2";

import ExpertInfo from "../expertInfo/ExpertInfo";
import FormList from "./FormList";

const ExpertLanguage = ({ expert, languageDropdown }) => {
  const languageList = expert?.languages || [];

  return (
    <Grid container>
      <Grid size={{ xs: 12 }}>
        <ExpertInfo expert={expert} />
        <FormList
          languageDropdown={languageDropdown}
          languageList={languageList}
        />
      </Grid>
    </Grid>
  );
};

export default ExpertLanguage;
