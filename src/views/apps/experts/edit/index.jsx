// MUI Imports
import Grid from "@mui/material/Grid2";

import EditForm from "./EditForm";

const ExpertEdit = ({ expertData, categoryData }) => {
  return (
    <Grid container>
      <Grid size={{ xs: 12 }}>
        <EditForm expertData={expertData} categoryData={categoryData} />
      </Grid>
    </Grid>
  );
};

export default ExpertEdit;
