// MUI Imports
import Grid from "@mui/material/Grid2";

// Component Imports
import TransactionInfo from "./Detail";

const TransactionsDetails = ({ transaction }) => {
  return (
    <Grid container>
      <Grid size={{ xs: 12 }}>
        <TransactionInfo transaction={transaction} />
      </Grid>
    </Grid>
  );
};

export default TransactionsDetails;
