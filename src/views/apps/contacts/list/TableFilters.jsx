// React Imports
import { useCallback, useEffect, useState } from "react";

// MUI Imports
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid2";
import MenuItem from "@mui/material/MenuItem";

// Component Imports
import CustomTextField from "@core/components/mui/TextField";
import { CONTACT_STATUS } from "@configs/constants";
import pageApiHelper from "@/utils/pageApiHelper";

const TableFilters = ({ filters, onFiltersChange, token }) => {
  const [subjects, setSubjects] = useState([]);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const fetchSubjects = async () => {
      try {
        const res = await pageApiHelper.get(
          "contacts/dropdown",
          {},
          token,
          {},
          controller.signal
        );

        if (res?.success) {
          const items = res.data?.data?.subjects || [];
          if (isMounted) setSubjects(items);
        }
      } catch (err) {
        // ignore
      }
    };

    fetchSubjects();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [token]);
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

  const handleSubjectChange = useCallback(
    (e) => {
      onFiltersChange({ subject: e.target.value });
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
            {CONTACT_STATUS.map((status) => (
              <MenuItem key={status.key} value={status.key}>
                {status.value}
              </MenuItem>
            ))}
          </CustomTextField>
        </Grid>

        {/* Subject */}
        <Grid size={{ xs: 12, sm: 3 }}>
          <CustomTextField
            label="Subject"
            select
            fullWidth
            value={filters.subject}
            onChange={handleSubjectChange}
          >
            <MenuItem value="all">All</MenuItem>
            {subjects.map((s) => (
              <MenuItem key={s.id} value={s.id}>{s.title}</MenuItem>
            ))}
          </CustomTextField>
        </Grid>
      </Grid>
    </CardContent>
  );
};

export default TableFilters;
