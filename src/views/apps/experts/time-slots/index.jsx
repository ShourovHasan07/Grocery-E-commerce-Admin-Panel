// MUI Imports

import Grid from "@mui/material/Grid2";

import ExpertInfo from "../languases/ExpertInfo";
import FormList from "./FormList";


const ExpertTimeSlot = ({ expertData,languageData }) => {
  
  return (
    <Grid container>      
      <Grid size={{ xs: 12 }}>

          <ExpertInfo expertData={expertData} />

          <FormList availabilityList={expertData?.availabilities || []} />
        
     
      </Grid>
    </Grid>
  );
};

export default ExpertTimeSlot; 


