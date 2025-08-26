// MUI Imports
import Grid from "@mui/material/Grid2";

import EditForm from "./EditForm";

const AdminEdit = ({ adminData, roles }) => {
  return (
    <Grid container>
      <Grid size={{ xs: 12 }}>
        <EditForm adminData={adminData} roles={roles} />
      </Grid>
    </Grid>
  );
};

export default AdminEdit;
