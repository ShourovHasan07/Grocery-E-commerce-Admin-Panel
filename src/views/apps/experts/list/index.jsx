// MUI Imports
import Grid from "@mui/material/Grid2";

// Component Imports
import ListTable from "./ListTable";

const UserList = ({ listData }) => {

   //console.log("UserList data:", listData);
  return (
    <Grid container>
      <Grid size={{ xs: 12 }}>
        <ListTable tableData={listData} />
      </Grid>
    </Grid>
  );
};

export default UserList;
