// MUI Imports
import Grid from "@mui/material/Grid2";

// Component Imports
import UserDetailsTable from "./UserDetailsTable";


const UsersListDetails = ({ tData, }) => {
  return (
    <Grid container>
      <Grid size={{ xs: 12 }}>
        <UserDetailsTable tableData={tData} />
        
      </Grid>
    </Grid>
  );
};

export default  UsersListDetails;
