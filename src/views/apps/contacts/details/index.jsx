// MUI Imports
import Grid from "@mui/material/Grid2";

// Component Imports
import DetailInfo from "./Detail";

const ContactDetail = ({ contact }) => {
  return (
    <Grid container>
      <Grid size={{ xs: 12 }}>
        <DetailInfo contact={contact} />
      </Grid>
    </Grid>
  );
};

export default ContactDetail;
