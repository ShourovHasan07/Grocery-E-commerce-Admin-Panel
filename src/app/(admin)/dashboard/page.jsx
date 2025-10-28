// MUI Imports
import Grid from "@mui/material/Grid2";

// Component Imports
import DailyProgress from "@views/dashboards/crm/DailyProgress";
import DeliveryExceptions from "@views/dashboards/crm/DeliveryExceptions";
import CardStatVertical from "@/components/card-statistics/Vertical";
import BarChartRevenueGrowth from "@views/dashboards/crm/BarChartRevenueGrowth";
import LastTransaction from "@views/dashboards/crm/LastTransaction";

// Server Action Imports
import { getServerMode } from "@core/utils/serverHelpers";

export const metadata = {
  title: "Dashboard - AskValor",
};

const DashboardCRM = async () => {
  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <BarChartRevenueGrowth />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <CardStatVertical
          title="Total Ongoing"
          subtitle="Today"
          avatarColor="info"
          avatarIcon="tabler-credit-card"
          avatarSkin="light"
          avatarSize={44}
          chipText="-12.2%"
          chipColor="info"
          chipVariant="tonal"
          qty={128}
          url={`/bookings?status=ongoing&startDate=&endDate=`}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <CardStatVertical
          title="Total Completed"
          subtitle="Today"
          avatarColor="success"
          avatarIcon="tabler-credit-card"
          avatarSkin="light"
          avatarSize={44}
          chipText="+24.67%"
          chipColor="success"
          chipVariant="tonal"
          qty={128}
          url={`/bookings?status=completed&startDate=&endDate=`}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <CardStatVertical
          title="Total Cancelled"
          subtitle="Today"
          avatarColor="error"
          avatarIcon="tabler-credit-card"
          avatarSkin="light"
          avatarSize={44}
          chipText="+24.67%"
          chipColor="error"
          chipVariant="error"
          qty={128}
          url={`/bookings?status=cancelled&startDate=&endDate=`}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <DeliveryExceptions />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <DailyProgress />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <LastTransaction title="Latest 5 Transactions" />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <LastTransaction title="Latest 5 Disbursements" />
      </Grid>
    </Grid>
  );
};

export default DashboardCRM;
