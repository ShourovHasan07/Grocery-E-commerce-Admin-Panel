// MUI Imports
import Grid from "@mui/material/Grid2";

import UserCreateForm from "./UserCreateForm";

const UserCreate = ({ createOptionData }) => {
  return (
    <Grid container>
      <Grid size={{ xs: 12 }}>
        <UserCreateForm tableData={createOptionData} />
      </Grid>
    </Grid>
  );
};

export default UserCreate;
