// MUI Imports
import Grid from "@mui/material/Grid2";

import EditForm from "./EditForm";

const RoleEdit = ({ role }) => {
  return (
    <Grid container>
      <Grid size={{ xs: 12 }}>
        <EditForm role={role} />
      </Grid>
    </Grid>
  );
};

export default RoleEdit;
