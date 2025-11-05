// MUI Imports
import Grid from "@mui/material/Grid2";

import MenuInfo from "./MenuInfo";
import FormList from "./FormList";

const MenuItemsList = ({ data }) => {
  return (
    <Grid container>
      <Grid size={{ xs: 12 }}>
        <MenuInfo menu={data?.menu || {}} />
      </Grid>
      <Grid size={{ xs: 12 }}>

        <FormList
          menuItems={data?.menu?.menuItems || []}
          pages={data?.pages || []}
        />
      </Grid>
    </Grid>
  );
};

export default MenuItemsList;
