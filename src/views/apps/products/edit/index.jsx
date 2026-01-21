// MUI Imports
import Grid from "@mui/material/Grid2";

import EditForm from "./EditForm";

const ProductEdit = ({ editProduct,  }) => {
  return (
    <Grid container>
      <Grid size={{ xs: 12 }}>
        <EditForm editProduct={editProduct} />
      </Grid>
    </Grid>
  );
};

export default ProductEdit;
