// MUI Imports

import Grid from "@mui/material/Grid2";

import ExpertInfo from "../languases/ExpertInfo";
import FormList from "./FormList";


const ExpertTime = ({ expertData,languageData }) => {
  
  return (
    <Grid container>      
      <Grid size={{ xs: 12 }}>

          <ExpertInfo expertData={expertData} />

          <FormList languageData={languageData} langulageList={expertData?.languages || []} />
        
     
      </Grid>
    </Grid>
  );
};

export default ExpertTime; 


