// MUI Imports
import Grid from "@mui/material/Grid2";

import EditForm from "./EditForm";

const AdminEdit = ({ listData }) => {

  return (
    <Grid container>
      <Grid size={{ xs: 12 }}>
        <EditForm RolesData={listData}  />
      </Grid>
    </Grid>
  );
};

export default AdminEdit;
