// MUI Imports
import Grid from "@mui/material/Grid2";

import CreateForm from "./CreateForm";

const ExpertCreate = ({ categoryData }) => {
  return (
    <Grid container>
      <Grid size={{ xs: 12 }}>
        <CreateForm categoryData={categoryData} />
      </Grid>
    </Grid>
  );
};

export default ExpertCreate;
