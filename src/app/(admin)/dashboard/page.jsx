// MUI Imports
import Grid from "@mui/material/Grid2";

// Component Imports
import BookingCards from "@/views/dashboards/crm/BookingCards";
import DailyProgress from "@views/dashboards/crm/DailyProgress";
import SkillWiseRatio from "@/views/dashboards/crm/SkillWiseRatio";
import LastTransaction from "@views/dashboards/crm/LastTransaction";
import LastDisbursement from "@views/dashboards/crm/LastDisbursement";

export const metadata = {
  title: "Dashboard - AskValor",
};

const DashboardCRM = async () => {
  return (
    <Grid container spacing={6}>
      <BookingCards />

      <Grid size={{ xs: 12, md: 6 }}>
        <SkillWiseRatio />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <DailyProgress />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <LastTransaction title="Latest 5 Transactions" />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <LastDisbursement title="Latest 5 Disbursements" />
      </Grid>
    </Grid>
  );
};

export default DashboardCRM;
