// React Imports
import { useState, useEffect } from "react";

// MUI Imports
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid2";
import MenuItem from "@mui/material/MenuItem";

// Component Imports
import CustomTextField from "@core/components/mui/TextField";
import { stringToBoolean } from "@/utils/helpers";

const TableFilters = ({ setData, tableData }) => {
  // States
  const [search, setInputSearch] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    const filteredData = tableData?.filter((item) => {
      if (search &&
        !item.name.toLowerCase().includes(search.toLowerCase()) &&
        !item.email.toLowerCase().includes(search.toLowerCase())
      ) return false;
      if (status && status != '' && item.status !== stringToBoolean(status)) return false;

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
            placeholder="Search by name, email..."
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
            <MenuItem value="active">Active</MenuItem>
            <MenuItem value="inactive">Inactive</MenuItem>
          </CustomTextField>
        </Grid>
      </Grid>
    </CardContent>
  );
};

export default TableFilters;
