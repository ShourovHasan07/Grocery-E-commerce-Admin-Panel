// MUI Imports
import Grid from "@mui/material/Grid2";

// Component Imports


import PageSections from "./PageSections";
import FormList from "./FormList";

const DetailUpdate = ({ page }) => {
  return (
    <Grid container>
      <Grid size={{ xs: 12 }}>

        <PageSections   page={page} />
        <FormList   page={page} />

    
        
       
      </Grid>
    </Grid>
  );
};

export default DetailUpdate;
