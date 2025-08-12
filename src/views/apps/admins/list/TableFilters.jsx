// React Imports
import { useState, useEffect } from "react";

import { useSession } from "next-auth/react";

// MUI Imports
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid2";
import MenuItem from "@mui/material/MenuItem";

// Component Imports
import CustomTextField from "@core/components/mui/TextField";
import { stringToBoolean } from "@/utils/helpers";

import pageApiHelper from "@/utils/pageApiHelper";

const TableFilters = ({ setData, tableData }) => {
  const { data: session } = useSession();
  const token = session?.accessToken;

  // States
  const [search, setInputSearch] = useState("");
  const [status, setStatus] = useState("");
  const [roles, setRoles] = useState([]);
  const [role, setRole] = useState("");

  useEffect(() => {
    const getRoles = async () => {
      if (token) {
        try {
          const result = await pageApiHelper.get('admins/create-edit-options', {}, token);

          if (result.success && result?.data?.data?.roles) {
            setRoles(result.data.data.roles);
          }
        } catch (error) {
        }
      }
    };

    getRoles()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const filteredData = tableData?.filter((item) => {
      if (search &&
        !item.name.toLowerCase().includes(search.toLowerCase()) &&
        !item.email.toLowerCase().includes(search.toLowerCase())
      ) return false;
      if (status && status != '' && item.status !== stringToBoolean(status)) return false;
      if (role && role != '' && item.roleId !== role) return false;

      return true;
    });

    setData(filteredData || []);
  }, [search, status, role, tableData, setData]);

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
            value={status}
            onChange={(e) => setStatus(e.target.value)}
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
