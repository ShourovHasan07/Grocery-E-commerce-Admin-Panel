// MUI Imports
import Grid from "@mui/material/Grid2";

import EditForm from "./EditForm";

const MenuEdit = ({ menuData }) => {
  return (
    <Grid container>
      <Grid size={{ xs: 12 }}>
        <EditForm menuData={menuData} />
      </Grid>
    </Grid>
  );
};

export default MenuEdit;
