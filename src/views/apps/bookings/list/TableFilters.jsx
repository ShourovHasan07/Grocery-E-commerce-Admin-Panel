// React Imports
import { useState, useEffect } from "react";

// MUI Imports
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid2";
import MenuItem from "@mui/material/MenuItem";

// Component Imports
import CustomTextField from "@core/components/mui/TextField";
import { BOOKING_STATUS } from "@configs/constants"

const TableFilters = ({ setData, tableData }) => {
  // States
  const [search, setInputSearch] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    const filteredData = tableData?.filter((item) => {
      if (search && !item.user.name.toLowerCase().includes(search.toLowerCase())) return false;
      if (status && status != '' && item.status !== status) return false;

      return true;
    });

    setData(filteredData || []);
  }, [search, status, tableData, setData]);

  return (
    <CardContent>
      <Grid container spacing={6}>
        <Grid size={{ xs: 12, sm: 4 }}>
          <CustomTextField
            fullWidth
            label="Search"
            id="text-input-search-user"
            value={search}
            onChange={(e) => setInputSearch(e.target.value)}
            placeholder="Search by name"
            className="max-sm:is-full"
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 4 }}>
          <CustomTextField
            label="Status"
            select
            fullWidth
            id="select-status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            slotProps={{
              select: { displayEmpty: true },
            }}
          >
            <MenuItem value="">All</MenuItem>
            {BOOKING_STATUS.length > 0 && BOOKING_STATUS.map((status) => (
              <MenuItem key={status.key} value={status.key}>{status.value}</MenuItem>
            ))}
          </CustomTextField>
        </Grid>
      </Grid>
    </CardContent>
  );
};

export default TableFilters;
