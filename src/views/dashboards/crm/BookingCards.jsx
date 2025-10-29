"use client";

import { useState, useEffect } from "react";

import Grid from "@mui/material/Grid2";

import { useSession } from "next-auth/react";

import CardStatVertical from "@/components/card-statistics/Vertical";
import BarChartRevenueGrowth from "@views/dashboards/crm/BarChartRevenueGrowth";

import pageApiHelper from "@/utils/pageApiHelper";

const BookingCards = () => {
  const { data: session } = useSession();
  const token = session?.accessToken;
  const [loading, setLoading] = useState(true);
  const [bookingStats, setBookingStats] = useState(null);

  useEffect(() => {
    const fetchBookingStats = async () => {
      if (token) {
        try {
          const result = await pageApiHelper.get(
            "dashboard/bookings",
            {},
            token,
          );

          if (result.success && result?.data?.bookings) {
            setBookingStats(result.data.bookings);
          }
        } catch (error) {
          // console.log("Error fetching booking stats:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchBookingStats();
  }, [token]);


  return (
    <>
      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <BarChartRevenueGrowth loading={loading} data={bookingStats?.monthly || []} />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <CardStatVertical
          title="Total Ongoing"
          subtitle="Today"
          avatarColor="info"
          avatarIcon="tabler-credit-card"
          avatarSkin="light"
          avatarSize={44}

          // chipText="-12.2%"
          chipColor="info"
          chipVariant="tonal"
          loading={loading}
          data={bookingStats?.ongoingToday || {}}
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

          // chipText="+24.67%"
          chipColor="success"
          chipVariant="tonal"
          loading={loading}
          data={bookingStats?.completedToday || {}}
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
          chipText="true"
          chipColor="error"
          chipVariant="error"
          loading={loading}
          data={bookingStats?.cancelledToday || {}}
          url={`/bookings?status=cancelled&startDate=&endDate=`}
        />
      </Grid>
    </>
  );
};

export default BookingCards;
