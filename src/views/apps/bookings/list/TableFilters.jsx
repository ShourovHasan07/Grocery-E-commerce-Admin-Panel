// React Imports
import { useCallback } from "react";

// MUI Imports
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid2";
import MenuItem from "@mui/material/MenuItem";

// Component Imports
import CustomTextField from "@core/components/mui/TextField";
import { BOOKING_STATUS } from "@configs/constants";
import AppReactDatepicker from "@/libs/styles/AppReactDatepicker";

const TableFilters = ({ filters, onFiltersChange }) => {
  // Handle individual filter changes
  const handleSearchChange = useCallback(
    (e) => {
      onFiltersChange({ search: e.target.value });
    },
    [onFiltersChange]
  );

  const handleStatusChange = useCallback(
    (e) => {
      onFiltersChange({ status: e.target.value });
    },
    [onFiltersChange]
  );

  const handleDateFromChange = useCallback(
    (date) => {
      onFiltersChange({ dateFrom: date || null });
    },
    [onFiltersChange]
  );

  const handleDateToChange = useCallback(
    (date) => {
      onFiltersChange({ dateTo: date || null });
    },
    [onFiltersChange]
  );

  return (
    <CardContent>
      <Grid container spacing={6}>
        {/* Search */}
        <Grid size={{ xs: 12, sm: 3 }}>
          <CustomTextField
            fullWidth
            label="Search"
            value={filters.search}
            onChange={handleSearchChange}
            placeholder="Search by name"
          />
        </Grid>

        {/* Status */}
        <Grid size={{ xs: 12, sm: 3 }}>
          <CustomTextField
            label="Status"
            select
            fullWidth
            value={filters.status}
            onChange={handleStatusChange}
          >
            <MenuItem value="all">All</MenuItem>
            {BOOKING_STATUS.map((status) => (
              <MenuItem key={status.key} value={status.key}>
                {status.value}
              </MenuItem>
            ))}
          </CustomTextField>
        </Grid>

        {/* Date From */}
        <Grid size={{ xs: 12, sm: 3 }}>
          <AppReactDatepicker
            selected={filters.dateFrom}
            onChange={handleDateFromChange}
            customInput={
              <CustomTextField
                label="Date From"
                placeholder="Select start date"
                fullWidth
              />
            }
            dateFormat="dd-MM-yyyy"
            placeholderText="Select start date"
            isClearable
          />
        </Grid>

        {/* Date To */}
        <Grid size={{ xs: 12, sm: 3 }}>
          <AppReactDatepicker
            selected={filters.dateTo}
            onChange={handleDateToChange}
            customInput={
              <CustomTextField
                label="Date To"
                placeholder="Select end date"
                fullWidth
              />
            }
            dateFormat="dd-MM-yyyy"
            placeholderText="Select end date"
            isClearable
            minDate={filters.dateFrom}
          />
        </Grid>
      </Grid>
    </CardContent>
  );
};

export default TableFilters;
