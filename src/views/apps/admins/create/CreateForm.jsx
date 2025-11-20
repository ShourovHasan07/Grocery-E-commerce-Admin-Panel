"use client";

// React Imports
import { useState } from "react";

import Link from "next/link";

// MUI Imports
import { useRouter } from "next/navigation";

import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid2";
import Button from "@mui/material/Button";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import InputAdornment from "@mui/material/InputAdornment";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";

// Third-party Imports
import { toast } from "react-toastify";
import { Controller, useForm } from "react-hook-form";

// Components Imports

import { useSession } from "next-auth/react";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import CustomTextField from "@core/components/mui/TextField";

import pageApiHelper from "@/utils/pageApiHelper";
import ProtectedRouteURL from "@/components/casl/ProtectedRoute";

// Validation Schema
const schema = z
  .object({
    roleId: z.number().min(1, "Role field is required"),
    name: z.string().min(3, "Name must be at least 3 characters"),
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirm_password: z
      .string()
      .min(6, "Confirm Password must be at least 6 characters"),
    phone: z.string().default(""),
    status: z.boolean().default(true),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
  });

const CreateForm = ({ tableData }) => {
  // States
  const [isPasswordShown, setIsPasswordShown] = useState(false);
  const [isConfirmPasswordShown, setIsConfirmPasswordShown] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Hooks
  const router = useRouter();

  const {
    control,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      roleId: "",
      name: "",
      email: "",
      phone: "",
      password: "",
      confirm_password: "",
      status: true,
    },
  });

  //form submission
  const { data: session } = useSession();
  const token = session?.accessToken;

  const onSubmit = async (formData) => {
    setIsSubmitting(true);

    try {
      const form = new FormData();

      form.append("roleId", formData.roleId);
      form.append("name", formData.name.trim());
      form.append("email", formData.email.trim());
      form.append("phone", formData.phone);
      form.append("password", formData.password);
      form.append("status", formData.status.toString());

      const headerConfig = {
        headers: { "Content-Type": "multipart/form-data" },
      };

      const res = await pageApiHelper.post(`admins`, form, token, headerConfig);

      if (!res?.success && res?.status === 400) {
        const errors = res?.data?.data?.errors || {};

        Object.keys(errors).forEach((key) => {
          setError(key, { type: "server", message: errors[key] });
        });

        return;
      }

      if (res?.success && res?.data?.success) {
        toast.success("Admin created successfully");
        reset();
        router.push("/admins");
      }
    } catch (error) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ProtectedRouteURL actions={["create"]} subject="Admin">
      <Card>
        <CardHeader title="New Admin Info" />
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={{ md: 6 }}>
              <Grid size={{ md: 6 }}>
                <Controller
                  name="roleId"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <CustomTextField
                      {...field}
                      select
                      fullWidth
                      className="mb-4"
                      label="Role"
                      placeholder="Select Role"
                      {...(errors.roleId && {
                        error: true,
                        helperText: errors.roleId.message,
                      })}
                    >
                      {tableData?.map((createOption) => (
                        <MenuItem key={createOption.id} value={createOption.id}>
                          {createOption.displayName}
                        </MenuItem>
                      ))}
                    </CustomTextField>
                  )}
                />
                <Controller
                  name="name"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <CustomTextField
                      {...field}
                      fullWidth
                      className="mb-4"
                      label="Name"
                      placeholder="Name"
                      {...(errors.name && {
                        error: true,
                        helperText: errors.name.message,
                      })}
                    />
                  )}
                />

                <Controller
                  name="email"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <CustomTextField
                      {...field}
                      fullWidth
                      type="email"
                      className="mb-4"
                      label="Email"
                      placeholder="Email"
                      {...(errors.email && {
                        error: true,
                        helperText: errors.email.message,
                      })}
                    />
                  )}
                />
              </Grid>

              <Grid size={{ md: 6 }}>
                <Controller
                  name="phone"
                  control={control}
                  rules={{ required: false }}
                  render={({ field }) => (
                    <CustomTextField
                      {...field}
                      fullWidth
                      className="mb-4"
                      label="Phone"
                      placeholder="Phone"
                      {...(errors.phone && {
                        error: true,
                        helperText: errors.phone.message,
                      })}
                    />
                  )}
                />

                <Controller
                  name="password"
                  control={control}
                  render={({ field }) => (
                    <CustomTextField
                      {...field}
                      fullWidth
                      type={isPasswordShown ? "text" : "password"}
                      label="Password"
                      placeholder="Password"
                      error={!!errors.password}
                      helperText={errors.password?.message}
                      className="mb-4"
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => setIsPasswordShown((prev) => !prev)}
                            >
                              <i
                                className={
                                  isPasswordShown
                                    ? "tabler-eye"
                                    : "tabler-eye-off"
                                }
                              />
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  )}
                />

                <Controller
                  name="confirm_password"
                  control={control}
                  render={({ field }) => (
                    <CustomTextField
                      {...field}
                      fullWidth
                      type={isConfirmPasswordShown ? "text" : "password"}
                      label="Confirm Password"
                      placeholder="Confirm Password"
                      error={!!errors.confirm_password}
                      helperText={errors.confirm_password?.message}
                      className="mb-4"
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() =>
                                setIsConfirmPasswordShown((prev) => !prev)
                              }
                            >
                              <i
                                className={
                                  isConfirmPasswordShown
                                    ? "tabler-eye"
                                    : "tabler-eye-off"
                                }
                              />
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  )}
                />

                <Controller
                  name="status"
                  control={control}
                  render={({ field }) => {
                    return (
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={Boolean(field.value)}
                            onChange={(e) => field.onChange(e.target.checked)}
                          />
                        }
                        label="Active"
                      />
                    );
                  }}
                />
              </Grid>

              <Grid size={{ xs: 12 }} className="flex gap-4">
                <Button
                  variant="contained"
                  type="submit"
                  disabled={isSubmitting}
                  endIcon={
                    isSubmitting ? (
                      <i className="tabler-rotate-clockwise-2 motion-safe:animate-spin" />
                    ) : null
                  }
                >
                  Submit
                </Button>
                <Button
                  variant="tonal"
                  color="secondary"
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => reset()}
                >
                  Reset
                </Button>

                <Button
                  variant="tonal"
                  color="error"
                  component={Link}
                  href={"/admins"}
                >
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
