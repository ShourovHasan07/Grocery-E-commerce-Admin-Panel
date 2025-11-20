"use client";

import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";
import Link from "next/link";

import { useSession } from "next-auth/react";

// MUI Imports
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid2";
import Button from "@mui/material/Button";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Typography from "@mui/material/Typography";

// Third-party Imports
import { toast } from "react-toastify";
import { Controller, useForm } from "react-hook-form";

// Components Imports
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import CustomTextField from "@core/components/mui/TextField";

import pageApiHelper from "@/utils/pageApiHelper";
import ProtectedRouteURL from "@/components/casl/ProtectedRoute";

//  Validation Schema
const schema = z.object({
  displayName: z
    .string()
    .min(1, "This field is required")
    .min(3, "Name must be at least 3 characters long"),
  status: z.boolean().default(true),
  permissions: z.array(z.number()).default([]),
});

const CreateForm = () => {
  const [permissionGroups, setPermissionGroups] = useState({});


  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { data: session } = useSession();
  const token = session?.accessToken;

  const {
    control,
    reset,
    handleSubmit,
    formState: { errors },
    setError,
    watch,
    setValue,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      displayName: "",
      status: true,
      permissions: [],
    },
  });

  const selectedPermissions = watch("permissions");

  // Global Select All
  const handleSelectAll = (checked) => {
    if (checked) {
      const allPerms = Object.values(permissionGroups).flatMap((g) => g.permissions.map((p) => p.id));

      setValue("permissions", allPerms);
    } else {
      setValue("permissions", []);
    }
  };

  // Select All for each group
  const handleSelectAllGroup = (groupKey, checked) => {
    const groupPermissions = permissionGroups[groupKey].permissions.map((p) => p.id);

    if (checked) {
      setValue("permissions", [...new Set([...selectedPermissions, ...groupPermissions])]);
    } else {
      setValue("permissions", selectedPermissions.filter((perm) => !groupPermissions.includes(perm)));
    }
  };

  // Submit Handler
  const onSubmit = async (formData) => {
    try {
      const payload = {
        displayName: formData.displayName.trim(),
        status: formData.status,
        permissions: formData.permissions,
      };

      const res = await pageApiHelper.post("roles/create", payload, token, {
        headers: { "Content-Type": "application/json" },
      });

      if (res?.success) {
        toast.success("Role created successfully");
        router.push("/roles");
      } else {
        toast.error(res?.data?.message || "Validation failed");
      }
    } catch (error) {
      toast.error(error.message || "Something went wrong");
    }
  };


  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        const res = await pageApiHelper.get("roles/subjects-with-permissions", { pageSize: 200 }, token);

        // console.log("Permissions API Response:", res);

        if (res?.success && res.data?.data?.subjects) {
          setPermissionGroups(res.data?.data?.subjects);
        }
      } catch (error) {
        // console.error("Failed to fetch permissions", error);
      }
    };

    if (token) fetchPermissions();
  }, [token]);

  return (
    <ProtectedRouteURL actions={["create"]} subject="Role">

      <Card>
        <CardHeader title="New Role Info" />
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={{ md: 4 }}>
              <Grid size={{ md: 6 }}>
                <Controller
                  name="displayName"
                  control={control}
                  render={({ field }) => (
                    <CustomTextField
                      {...field}
                      fullWidth
                      className="mb-4"
                      label="Name"
                      placeholder="Role name"
                      error={!!errors.displayName}
                      helperText={errors.displayName?.message}
                    />
                  )}
                />

                <Controller
                  name="status"
                  control={control}
                  render={({ field }) => (
                    <FormControlLabel
                      control={<Checkbox {...field} checked={field.value} />}
                      label="Active"
                    />
                  )}
                />
              </Grid>

              <Grid size={{ xs: 12 }}>
                <div>
                  <Typography variant="h6" sx={{ mb: 1 }}>
                    Permissions
                  </Typography>

                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={
                          selectedPermissions.length ===
                          Object.values(permissionGroups).flatMap((g) => g.permissions).length
                        }
                        indeterminate={
                          selectedPermissions.length > 0 &&
                          selectedPermissions.length <
                          Object.values(permissionGroups).flatMap((g) => g.permissions).length
                        }
                        onChange={(e) => handleSelectAll(e.target.checked)}
                      />
                    }
                    label="Select All (All Modules)"
                  />
                </div>

                {Object.entries(permissionGroups).map(([groupKey, group]) => (
                  <div key={group.id} className="mb-3 flex flex-col border px-4 py-2 rounded-md mt-2">
                    <div className="flex items-center gap-4">
                      <Typography variant="h6">
                        {group.name}
                      </Typography>

                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={group.permissions.every((p) => selectedPermissions.includes(p.id))}
                            indeterminate={
                              group.permissions.some((p) => selectedPermissions.includes(p.id)) &&
                              !group.permissions.every((p) => selectedPermissions.includes(p.id))
                            }
                            onChange={(e) => handleSelectAllGroup(groupKey, e.target.checked)}
                          />
                        }
                        label={`Select All`}
                        className="me-0"
                      />
                    </div>

                    <Grid container spacing={2}>
                      {group.permissions.map((perm) => (
                        <Grid size={{ xs: 12, sm: 6, md: 3 }} key={perm.id}>
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={selectedPermissions.includes(perm.id)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setValue("permissions", [...selectedPermissions, perm.id]);
                                  } else {
                                    setValue(
                                      "permissions",
                                      selectedPermissions.filter((id) => id !== perm.id)
                                    );
                                  }
                                }}
                              />
                            }
                            label={perm.name}
                          />
                        </Grid>
                      ))}
                    </Grid>
                  </div>
                ))}
              </Grid>

              <Grid size={{ xs: 12 }} className="flex gap-4 mt-4">
                <Button
                  variant="contained"
                  type="submit"
                  disabled={isSubmitting}
                >
                  Submit
                </Button>

                <Button variant="tonal" color="error" component={Link} href={"/roles"}>
                  Cancel
                </Button>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>

    </ProtectedRouteURL>
  );
};

export default CreateForm;
