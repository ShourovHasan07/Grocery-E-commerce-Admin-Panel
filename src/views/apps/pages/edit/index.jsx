// MUI Imports
import Grid from "@mui/material/Grid2";

import EditForm from "./EditForm";

const PageEdit = ({ pageData }) => {

  return (
    <Grid container>
      <Grid size={{ xs: 12 }}>
        <EditForm page={pageData} />
      </Grid>
    </Grid>
  );
};

export default PageEdit;
