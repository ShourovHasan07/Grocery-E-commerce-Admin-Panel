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
    const [dashBoardData, setDashBoardData] = useState(null);







useEffect(() => {
  const fetchBookingStats = async () => {
    if (!token) return; //  token  return

    try {
      const response = await fetch(
        "http://localhost:4000/admin/dashboard/stats",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, //  token 
          },
        }
      );

      const result = await response.json();

      console.log("Booking Stats:", result);

      if (response.ok && result) {
        //  backend success response 
        setBookingStats(result);
        setDashBoardData(result);
      } else {
        console.error("Error fetching stats:", result);
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };






  fetchBookingStats();
}, [token]);



  return (
    <>
      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <BarChartRevenueGrowth loading={loading} data={dashBoardData?.totalIncome || []} />  
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
