// MUI Imports
import Grid from "@mui/material/Grid2";

// Component Imports
import ListTable from "./ListTable";

const PagesList = ({ tData }) => {
  return (
    <Grid container>
      <Grid size={{ xs: 12 }}>
        <ListTable tableData={tData} />
      </Grid>
    </Grid>
  );
};

export default PagesList;
