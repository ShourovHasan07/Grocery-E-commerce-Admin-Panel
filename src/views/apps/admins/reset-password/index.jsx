// MUI Imports
import Grid from "@mui/material/Grid2";

import ResetPasswordForm from "./ResetPasswordForm";

const AdminResetPassword = ({ adminData,  }) => {

  return (
    <Grid container>
      <Grid size={{ xs: 12 }}>
        <ResetPasswordForm adminData={adminData}  />
      </Grid>
    </Grid>
  );
};

export default AdminResetPassword;
