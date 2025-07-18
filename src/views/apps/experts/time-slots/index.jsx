// MUI Imports

import Grid from "@mui/material/Grid2";

import ExpertInfo from "./ExpertInfo";
import FormList from "./FormList";


const ExpertTimeSlot = ({ expertData }) => {

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


