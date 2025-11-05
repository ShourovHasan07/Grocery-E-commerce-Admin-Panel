// MUI Imports
import Grid from "@mui/material/Grid2";

// Component Imports

import EditForm from "./EditForm";

const DetailUpdate = ({ data }) => {
  return (
    <Grid container>
      <Grid size={{ xs: 12 }}>
        <EditForm data={data} />
      </Grid>
    </Grid>
  );
};

export default DetailUpdate;
