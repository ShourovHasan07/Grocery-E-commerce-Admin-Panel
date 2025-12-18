// React Imports
import { useCallback } from "react";

// MUI Imports
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid2";
import MenuItem from "@mui/material/MenuItem";

// Component Imports
import CustomTextField from "@core/components/mui/TextField";

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

  return (
    <CardContent>
      <Grid container spacing={6}>
        <Grid size={{ xs: 12, sm: 4 }}>
          <CustomTextField
            fullWidth
            label="Search"
            id="text-input-search-user"
            value={filters.search}
            onChange={handleSearchChange}
            placeholder="Search by name, email or phone"
            className="max-sm:is-full"
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 4 }}>
          <CustomTextField
            label="Status"
            select
            fullWidth
            id="select-status"
            value={filters.status}
            onChange={handleStatusChange}
            slotProps={{
              select: { displayEmpty: true },
            }}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="true">Active</MenuItem>
            <MenuItem value="false">Inactive</MenuItem>
          </CustomTextField>
        </Grid>
      </Grid>
    </CardContent>
  );
};

export default TableFilters;
