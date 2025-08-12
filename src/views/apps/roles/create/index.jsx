// MUI Imports
import Grid from "@mui/material/Grid2";

import CreateForm from "./CreateForm";

const RolesCreate = () => {

  //console.log("ExpertCreate categoryData:", categoryData);

  return (
    <Grid container>
      <Grid size={{ xs: 12 }}>
        <CreateForm  />
      </Grid>
    </Grid>
  );
};

export default RolesCreate;
