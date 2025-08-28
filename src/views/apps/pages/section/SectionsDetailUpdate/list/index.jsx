// MUI Imports
import Grid from "@mui/material/Grid2";

// Component Imports

import EditForm from "./EditForm";

const DetailUpdate = ({ pageSection }) => {
  return (
    <Grid container>
      <Grid size={{ xs: 12 }}>
        <EditForm pageSection={pageSection} />
      </Grid>
    </Grid>
  );
};

export default DetailUpdate;
