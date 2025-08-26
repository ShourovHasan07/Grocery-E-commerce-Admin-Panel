// MUI Imports
import Grid from "@mui/material/Grid2";

// Component Imports
import UserDetail from "./UserDetail";

const UsersDetails = ({ user }) => {
  return (
    <Grid container>
      <Grid size={{ xs: 12 }}>
        <UserDetail user={user} />
      </Grid>
    </Grid>
  );
};

export default UsersDetails;
