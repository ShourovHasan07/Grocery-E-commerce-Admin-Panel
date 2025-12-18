// MUI Imports
import Grid from "@mui/material/Grid2";

// Component Imports
import ListTable from "./ListTable";

const ExpertList = () => {
  return (
    <Grid container>
      <Grid size={{ xs: 12 }}>
        <ListTable />
      </Grid>
    </Grid>
  );
};

export default ExpertList;
