"use client";

// React Imports
import { useEffect, useRef, useState } from "react";

import { useRouter } from "next/navigation";
import Link from "next/link";

// MUI Imports
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid2";
import Button from "@mui/material/Button";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";

// Third-party Imports
import { toast } from "react-toastify";
import { Controller, useForm } from "react-hook-form";

// Components Imports
import { z } from "zod";

import { zodResolver } from "@hookform/resolvers/zod";

import { useSession } from "next-auth/react";

import { IconButton, InputAdornment } from "@mui/material";

import CustomTextField from "@core/components/mui/TextField";

import pageApiHelper from "@/utils/pageApiHelper";

// Zod Imports
const schema = z

  .object({
    name: z
      .string()
      .min(1, "This field is required")
      .min(3, "Name must be at least 3 characters long"),
    email: z
      .string()
      .min(1, "This field is required")
      .email("Please enter a valid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirm_password: z
      .string()
      .min(6, "Confirm Password must be at least 6 characters"),
    status: z.boolean().default(true),
  })

  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
  });

const EditForm = ({ adminData }) => {
  const router = useRouter();

  // States
  const [isPasswordShown, setIsPasswordShown] = useState(false);
  const [isConfirmPasswordShown, setIsConfirmPasswordShown] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: session } = useSession();
  const token = session?.accessToken;

  const {
    control,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      ...adminData,
      password: "",
      confirm_password: "",
    },
  });

  // form submission
  const onSubmit = async (formData) => {
    setIsSubmitting(true);

    try {
      const form = new FormData();

      form.append("password", formData.password);
      form.append("confirmPassword", formData.confirm_password);

      const res = await pageApiHelper.put(
        `admins/${adminData.id}/reset-password`,
        form,
        token,
      );

      if (!res?.success && res?.status === 400) {
        let errors = res?.data?.data?.errors || [];

        if (errors) {
          Object.keys(errors).forEach((key) => {
            setError(key, {
              type: "server",
              message: errors[key],
            });
          });
        }

        return;
      }

      if (res?.success && res?.data?.data?.success) {
        toast.success("admin password updated successfully");

        router.push("/admins");
      }
    } catch (error) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader title="Admin Reset Password Info" />
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={{ md: 6 }}>
            <Grid size={{ md: 6 }}>
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
                    placeholder="name"
                    disabled
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
                    placeholder="email"
                    disabled
                    {...(errors.email && {
                      error: true,
                      helperText: errors.email.message,
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
            </Grid>

            <Grid size={{ md: 6 }}></Grid>

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
  );
};

export default EditForm;
