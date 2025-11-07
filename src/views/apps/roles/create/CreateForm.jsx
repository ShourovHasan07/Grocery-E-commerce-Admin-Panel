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

//  Validation Schema
const schema = z.object({


  displayName: z
    .string()
    .min(1, "This field is required")
    .min(3, "Name must be at least 3 characters long"),
  status: z.boolean().default(true),
  permissions: z.array(z.number()).default([]),
});








// const permissionGroups = {
//   Role: { id: 1, permissions: [{ id: 1, name: "Roles - Read" }, { id: 2, name: "Roles - Create" }, { id: 3, name: "Roles - Update" }, { id: 4, name: "Roles - Delete" }] },
//   Admin: { id: 2, permissions: [{ id: 5, name: "Admins - Read" }, { id: 6, name: "Admins - Create" }, { id: 7, name: "Admins - Update" }, { id: 8, name: "Admins - Delete" }] },
//   Category: { id: 3, permissions: [{ id: 9, name: "Categories - Read" }, { id: 10, name: "Categories - Create" }, { id: 11, name: "Categories - Update" }, { id: 12, name: "Categories - Delete" }] },
//   Achievement: { id: 4, permissions: [{ id: 13, name: "Achievements - Read" }, { id: 14, name: "Achievements - Create" }, { id: 15, name: "Achievements - Update" }, { id: 16, name: "Achievements - Delete" }] },
//   Language: { id: 5, permissions: [{ id: 17, name: "Languages - Read" }, { id: 18, name: "Languages - Create" }, { id: 19, name: "Languages - Update" }, { id: 20, name: "Languages - Delete" }] },
//   Expert: { id: 6, permissions: [{ id: 21, name: "Experts - Read" }, { id: 22, name: "Experts - Create" }, { id: 23, name: "Experts - Update" }, { id: 24, name: "Experts - Delete" }] },
//   User: { id: 7, permissions: [{ id: 25, name: "Users - Read" }, { id: 26, name: "Users - Create" }, { id: 27, name: "Users - Update" }, { id: 28, name: "Users - Delete" }] },
//   Bookings: { id: 8, permissions: [{ id: 29, name: "Bookings - Read" }, { id: 30, name: "Bookings - Create" }, { id: 31, name: "Bookings - Update" }, { id: 32, name: "Bookings - Delete" }] },
//   Transaction: { id: 9, permissions: [{ id: 33, name: "Transaction - Read" }, { id: 34, name: "Transaction - Create" }, { id: 35, name: "Transaction - Update" }, { id: 36, name: "Transaction - Delete" }] },
//   Pages: { id: 10, permissions: [{ id: 37, name: "Pages - Read" }, { id: 38, name: "Pages - Create" }, { id: 39, name: "Pages - Update" }, { id: 40, name: "Pages - Delete" }] },
// };

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

        //console.log("Permissions API Response:", res);

        if (res?.success && res.data?.data?.subjects) {
          const groups = {};
          res.data.data.subjects.forEach((subject) => {
            groups[subject.name] = {
              id: subject.id,
              permissions: subject.permissions.map((p) => ({ id: p.id, name: `${subject.name} - ${p.name}` })),
            };
          });
          setPermissionGroups(groups);
        }
      } catch (error) {
        console.error("Failed to fetch permissions", error);
      }
    };

    if (token) fetchPermissions();
  }, [token]);



  return (
    <Card>
      <CardHeader title="New Role Info" />
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={{ md: 6 }}>
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





            <Grid size={{ xs: 12 }} sx={{ mt: 3 }}>

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
                <div key={groupKey} style={{ marginBottom: "24px" }}>


                  <div className="flex items-center  gap-8 mb-2">
                    <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                      {groupKey}
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
                      label={`Select All ${groupKey}`}
                    />
                  </div>





                  <Grid container spacing={2}>
                    {group.permissions.map((perm) => (
                      <Grid item xs={12} sm={6} md={3} key={perm.id}>
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

              <Button variant="tonal" color="secondary" type="reset" onClick={reset}>
                Reset
              </Button>

              <Button variant="tonal" color="error" component={Link} href={"/roles"}>
                Cancel
              </Button>
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </Card>
  );
};

export default CreateForm; 
