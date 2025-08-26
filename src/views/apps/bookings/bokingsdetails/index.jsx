// MUI Imports
import Grid from "@mui/material/Grid2";

// Component Imports
import BookingDetail from "./BookingDetail";

const BookingsDetails = ({ booking }) => {
  return (
    <Grid container>
      <Grid size={{ xs: 12 }}>
        <BookingDetail booking={booking.booking} />
      </Grid>
    </Grid>
  );
};

export default BookingsDetails;
