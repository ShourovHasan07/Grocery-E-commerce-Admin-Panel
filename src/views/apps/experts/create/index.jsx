// MUI Imports
import Grid from "@mui/material/Grid2";

import CreateForm from "./CreateForm";

const ExpertCreate = ({ categoryData }) => {

  //console.log("ExpertCreate categoryData:", categoryData);

  return (
    <Grid container>
      <Grid size={{ xs: 12 }}>
        <CreateForm categoryData={categoryData} />
      </Grid>
    </Grid>
  );
};

export default ExpertCreate;
