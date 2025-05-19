// React Imports
import { useState, useEffect } from "react";

// MUI Imports
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid2";
import MenuItem from "@mui/material/MenuItem";

// Component Imports
import CustomTextField from "@core/components/mui/TextField";

const TableFilters = ({ setData, tableData }) => {
  // States
  const [search, setInputSearch] = useState("");
  const [role, setRole] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    const filteredData = tableData?.filter((user) => {
      if (search && !user.fullName.toLowerCase().includes(search.toLowerCase())) return false;
      if (role && user.role !== role) return false;
      if (status && user.status !== status) return false;

      return true;
    });

    setData(filteredData || []);
  }, [search, role, status, tableData, setData]);

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
            value={role}
            onChange={(e) => setRole(e.target.value)}
            slotProps={{
              select: { displayEmpty: true },
            }}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="admin">Admin</MenuItem>
            <MenuItem value="author">Author</MenuItem>
            <MenuItem value="editor">Editor</MenuItem>
            <MenuItem value="maintainer">Maintainer</MenuItem>
            <MenuItem value="subscriber">Subscriber</MenuItem>
          </CustomTextField>
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
            <MenuItem value="active">Active</MenuItem>
            <MenuItem value="inactive">Inactive</MenuItem>
          </CustomTextField>
        </Grid>
      </Grid>
    </CardContent>
  );
};

export default TableFilters;
