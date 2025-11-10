"use client";

import { useState, useEffect } from "react";

import { useParams, useRouter } from "next/navigation";
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

import pageApiHelper from "@/utils/pageApiHelper";
import CustomTextField from "@core/components/mui/TextField";

// ✅ Validation Schema
const schema = z.object({
  displayName: z
    .string()
    .min(1, "This field is required")
    .min(3, "Name must be at least 3 characters long"),
  status: z.boolean().default(true),
  permissions: z.array(z.number()).default([]),
});

const UpdateForm = ({ role }) => {
  const router = useRouter();
  const params = useParams();
  const id = params.id;

  const { data: session } = useSession();
  const token = session?.accessToken;

  const [permissionGroups, setPermissionGroups] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    control,
    reset,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      ...role && {
        displayName: role.displayName,
        status: role.status,
        permissions: role.permissions.map((p) => p.id),
      },
    },
  });

  const selectedPermissions = watch("permissions");

  // Fetch Permissions
  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        const res = await pageApiHelper.get(
          "roles/subjects-with-permissions",
          { pageSize: 200 },
          token
        );

        if (res?.success && res.data?.data?.subjects) {
          setPermissionGroups(res.data?.data?.subjects);
        }
      } catch (error) {
        // console.error("Failed to fetch permissions", error);
      }
    };

    if (token) fetchPermissions();
  }, [token]);

  // Select All Handlers
  const handleSelectAll = (checked) => {
    if (checked) {
      const allPerms = Object.values(permissionGroups).flatMap((g) =>
        g.permissions.map((p) => p.id)
      );

      setValue("permissions", allPerms);
    } else {
      setValue("permissions", []);
    }
  };

  const handleSelectAllGroup = (groupKey, checked) => {
    const groupPermissions = permissionGroups[groupKey].permissions.map(
      (p) => p.id
    );

    if (checked) {
      setValue(
        "permissions",
        [...new Set([...selectedPermissions, ...groupPermissions])]
      );
    } else {
      setValue(
        "permissions",
        selectedPermissions.filter((id) => !groupPermissions.includes(id))
      );
    }
  };

  // Submit Handler
  const onSubmit = async (formData) => {
    setIsSubmitting(true);

    try {
      const payload = {
        displayName: formData.displayName.trim(),
        status: formData.status,
        permissions: formData.permissions,
      };

      const res = await pageApiHelper.put(
        `roles/${id}`,
        payload,
        token,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      if (res?.success) {
        toast.success("Role updated   successfully");
        router.push("/roles");
      } else {
        toast.error(res?.data?.message || "Validation failed");
      }
    } catch (error) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader title="Update Role Info" />
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
              <Typography variant="h6" sx={{ mb: 1 }}>
                Permissions
              </Typography>

              <FormControlLabel
                control={
                  <Checkbox
                    checked={
                      selectedPermissions.length ===
                      Object.values(permissionGroups).flatMap(
                        (g) => g.permissions
                      ).length
                    }
                    indeterminate={
                      selectedPermissions.length > 0 &&
                      selectedPermissions.length <
                      Object.values(permissionGroups).flatMap(
                        (g) => g.permissions
                      ).length
                    }
                    onChange={(e) => handleSelectAll(e.target.checked)}
                  />
                }
                label="Select All (All Modules)"
              />

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
                    {group.permissions?.map((perm) => (
                      <Grid size={{ xs: 12, sm: 6, md: 3 }} key={perm.id}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={selectedPermissions.includes(perm.id)}
                              onChange={(e) => {
                                if (e.target.checked)
                                  setValue("permissions", [
                                    ...selectedPermissions,
                                    perm.id,
                                  ]);
                                else
                                  setValue(
                                    "permissions",
                                    selectedPermissions.filter(
                                      (id) => id !== perm.id
                                    )
                                  );
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
                Update
              </Button>
              <Button
                variant="tonal"
                color="error"
                component={Link}
                href="/roles"
              >
                Cancel
              </Button>
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </Card>
  );
};

export default UpdateForm;
