// React Imports
import { useState, useEffect, useCallback } from "react";

import { useSession } from "next-auth/react";

// MUI Imports
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid2";
import MenuItem from "@mui/material/MenuItem";

// Component Imports
import CustomTextField from "@core/components/mui/TextField";
import { stringToBoolean } from "@/utils/helpers";

import pageApiHelper from "@/utils/pageApiHelper";

const TableFilters = ({ filters, onFiltersChange }) => {
  const { data: session } = useSession();
  const token = session?.accessToken;

  // States
  const [roles, setRoles] = useState([]);

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

  const handleRoleChange = useCallback(
    (e) => {
      onFiltersChange({ role: e.target.value });
    },
    [onFiltersChange]
  );

  useEffect(() => {
    const getRoles = async () => {
      if (token) {
        try {
          const result = await pageApiHelper.get(
            "admins/create-edit-options",
            {},
            token,
          );

          if (result.success && result?.data?.data?.roles) {
            setRoles(result.data.data.roles);
          }
        } catch (error) {}
      }
    };

    getRoles();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
            placeholder="Search by name, email..."
            className="max-sm:is-full"
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 4 }}>
          <CustomTextField
            label="Role"
            select
            fullWidth
            id="select-role"
            value={filters.role}
            onChange={handleRoleChange}
            slotProps={{
              select: { displayEmpty: true },
            }}
          >
            <MenuItem value="">All</MenuItem>
            {roles?.map((role) => (
              <MenuItem key={role.id} value={role.id}>
                {role.displayName}
              </MenuItem>
            ))}
          </CustomTextField>
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
