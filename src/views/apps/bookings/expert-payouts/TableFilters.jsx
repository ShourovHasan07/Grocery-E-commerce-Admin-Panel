// React Imports
import { useState, useEffect, useCallback } from "react";

import { useSession } from "next-auth/react";

// MUI Imports
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid2";

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

  return (
    <CardContent>
      <Grid container spacing={6}>
        {/* Search */}
        <Grid size={{ xs: 12, sm: 4 }}>
          <CustomTextField
            fullWidth
            label="Search"
            value={filters.search}
            onChange={handleSearchChange}
            placeholder="Search by name, email or phone"
          />
        </Grid>
      </Grid>
    </CardContent>
  );
};

export default TableFilters;
