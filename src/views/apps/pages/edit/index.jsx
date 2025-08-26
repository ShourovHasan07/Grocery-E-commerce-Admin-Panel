// MUI Imports
import Grid from "@mui/material/Grid2";

import EditForm from "./EditForm";
import AboutEditForm from "./AboutEditForm";

const PageEdit = ({ pageData }) => {
  console.log(pageData);

  return (
    <Grid container>
      <Grid size={{ xs: 12 }}>
        {pageData.type === "rte" && <EditForm page={pageData} />}
        {pageData.type === "predefine" && pageData.url === "about-us" && (
          <AboutEditForm page={pageData} />
        )}
      </Grid>
    </Grid>
  );
};

export default PageEdit;
