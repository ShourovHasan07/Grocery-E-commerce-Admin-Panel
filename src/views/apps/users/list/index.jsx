// MUI Imports
import Grid from "@mui/material/Grid2";

// Component Imports
import ListTable from "./ListTable";


const UsersList = ({ tData, }) => {
  return (
    <Grid container>
      <Grid size={{ xs: 12 }}>
        <ListTable tableData={tData} />
        
      </Grid>
    </Grid>
  );
};

export default UsersList;
