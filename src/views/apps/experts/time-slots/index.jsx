// MUI Imports

import Grid from "@mui/material/Grid2";

import ExpertInfo from "../expertInfo/ExpertInfo";
import FormList from "./FormList";


const ExpertTimeSlot = ({ expert, weekDaysDropdown }) => {
  const availabilityList = expert?.availabilities || []

  return (
    <Grid container>
      <Grid size={{ xs: 12 }}>
        <ExpertInfo expert={expert} />

        <FormList weekDaysDropdown={weekDaysDropdown} availabilityList={availabilityList} />
      </Grid>
    </Grid>
  );
};

export default ExpertTimeSlot;


