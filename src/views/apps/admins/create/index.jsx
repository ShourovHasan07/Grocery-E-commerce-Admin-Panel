// MUI Imports
import Grid from "@mui/material/Grid2";

import UserCreateForm from "./UserCreateForm";

const UserCreate = ({ userData }) => {
  return (
    <Grid container>
      <Grid size={{ xs: 12 }}>
        <UserCreateForm tableData={userData} />
      </Grid>
    </Grid>
  );
};

export default UserCreate;
