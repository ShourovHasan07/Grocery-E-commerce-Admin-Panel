// React Imports
import { useState, useEffect } from "react";

// MUI Imports
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid2";
import MenuItem from "@mui/material/MenuItem";

// Component Imports
import CustomTextField from "@core/components/mui/TextField";
import { TRANSACTION_STATUS } from "@configs/constants";
import AppReactDatepicker from "@/libs/styles/AppReactDatepicker";

const TableFilters = ({ setData, tableData }) => {
  // States
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    const end = endDate ? new Date(new Date(endDate).getTime() + 24 * 60 * 60 * 1000 - 1) : null;


    const filteredData = tableData?.filter((item) => {
      const createdAt = new Date(item.createdAt);

      // Filter by multiple fields in search
      if (search && search.trim() !== "") {
        const searchLower = search.toLowerCase();
        const transactionId = item?.transactionId || "";
        const userName = item?.user?.name || "";
        const expertName = item?.expert?.name || "";

        const matchesTransactionId = transactionId.toLowerCase().includes(searchLower);
        const matchesUserName = userName.toLowerCase().includes(searchLower);
        const matchesExpertName = expertName.toLowerCase().includes(searchLower);

        // Return false if none of the fields match
        if (!matchesTransactionId && !matchesUserName && !matchesExpertName) return false;
      }

      // Filter by status
      if (status && status !== "" && item.status !== status) return false;

      // Filter by Start and End Dates
      if (startDate && createdAt < new Date(startDate)) return false;
      if (end && createdAt > end) return false;


      return true;
    });

    setData(filteredData || []);
  }, [search, status, startDate, endDate, tableData, setData]);

  return (
    <CardContent>
      <Grid container spacing={6}>
        {/* Search */}
        <Grid size={{ xs: 12, sm: 3 }}>
          <CustomTextField
            fullWidth
            label="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by transaction ID, user name, or expert name"
          />
        </Grid>

        {/* Status */}
        <Grid size={{ xs: 12, sm: 3 }}>
          <CustomTextField
            label="Status"

            select
            fullWidth
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <MenuItem value="">All</MenuItem>
            {TRANSACTION_STATUS.map((status) => (
              <MenuItem key={status.key} value={status.key}>
                {status.value}
              </MenuItem>
            ))}
          </CustomTextField>
        </Grid>


        {/* Start Date */}
        <Grid size={{ xs: 12, sm: 3 }}>
          <AppReactDatepicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}

            customInput={<CustomTextField label="Start Date" placeholder="Select start date & time" fullWidth />}
            dateFormat="dd-MM-yyyy"


            placeholderText="Select start date "



          />
        </Grid>

        {/* End Date */}
        <Grid size={{ xs: 12, sm: 3 }}>
          <AppReactDatepicker
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            customInput={<CustomTextField label="End Date" fullWidth />}
            dateFormat=" dd-MM-yyyy"
            placeholderText="Select End  date "

          />
        </Grid>
      </Grid>
    </CardContent>
  );
};

export default TableFilters;
