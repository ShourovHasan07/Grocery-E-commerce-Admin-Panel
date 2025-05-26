// MUI Imports
import Grid from "@mui/material/Grid2";

import CreateForm from "./CreateForm";

const ExpertCreate = ({ userData }) => {
  return (
    <Grid container>
      <Grid size={{ xs: 12 }}>
        <CreateForm tableData={userData} />
      </Grid>
    </Grid>
  );
};

export default ExpertCreate;
