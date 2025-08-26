// MUI Imports
import Grid from "@mui/material/Grid2";

// Component Imports
import Details from "./Details";

const LeftOverview = ({ expertData }) => {
  return (
    <Grid container>
      <Grid size={{ xs: 12 }}>
        <Details expertData={expertData} />
      </Grid>
    </Grid>
  );
};

export default LeftOverview;
