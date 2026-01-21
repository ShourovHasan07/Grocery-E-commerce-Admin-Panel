// MUI Imports
import Grid from "@mui/material/Grid2";

// Component Imports
import ProductDetails from "./ProductDetails";

const Productdetails = (editProduct) => {
  return (
    <Grid container>
      <Grid size={{ xs: 12 }}>
        <ProductDetails product={editProduct} />
      </Grid>
    </Grid>
  );
};

export default Productdetails;
