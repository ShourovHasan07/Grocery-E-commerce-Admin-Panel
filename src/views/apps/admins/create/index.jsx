// MUI Imports
import Grid from "@mui/material/Grid2";

import CreateForm from "./CreateForm";

const AdminCreate = ({ createOptionData }) => {
  return (
    <Grid container>
      <Grid size={{ xs: 12 }}>
        <CreateForm tableData={createOptionData} />
      </Grid>
    </Grid>
  );
};

export default AdminCreate;
