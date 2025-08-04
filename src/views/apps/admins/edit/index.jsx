// MUI Imports
import Grid from "@mui/material/Grid2";

import EditForm from "./EditForm";

const AdminEdit = ({ adminData }) => {

  return (
    <Grid container>
      <Grid size={{ xs: 12 }}>
        <EditForm adminData={adminData}  />
      </Grid>
    </Grid>
  );
};

export default AdminEdit;
