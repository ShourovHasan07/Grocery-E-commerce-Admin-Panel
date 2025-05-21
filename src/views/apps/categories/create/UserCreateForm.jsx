"use client";

// React Imports
import { useState } from "react";

import Link from "next/link";

// MUI Imports
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
import { valibotResolver } from "@hookform/resolvers/valibot";
import { email, object, minLength, string, pipe, nonEmpty } from "valibot";

// Components Imports
import CustomTextField from "@core/components/mui/TextField";

const schema = object({
  role_id: pipe(
    string(),
    nonEmpty("This field is required"),
  ),
  name: pipe(
    string(),
    nonEmpty("This field is required"),
    minLength(3, "Name must be at least 3 characters long"),
  ),
  phone: pipe(
    string(),
    nonEmpty("This field is required"),
    minLength(3, "Phone must be at least 3 characters long"),
  ),
  email: pipe(
    string(),
    minLength(1, "This field is required"),
    email("Please enter a valid email address"),
  ),
  password: pipe(
    string(),
    nonEmpty("This field is required"),
    minLength(6, "Password must be at least 6 characters long"),
  ),
  confirm_password: pipe(
    string(),
    nonEmpty("This field is required"),
    minLength(6, "Confirm Password must be at least 6 characters long"),
  ),
});

const UserCreateForm = () => {
  // States
  const [isPasswordShown, setIsPasswordShown] = useState(false);
  const [isConfirmPasswordShown, setIsConfirmPasswordShown] = useState(false);

  // Hooks
  const {
    control,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: valibotResolver(schema),
    defaultValues: {
      role_id: "",
      name: "",
      phone: "",
      email: "",
      password: "",
      confirm_password: "",
      status: true,
    },
  });

  const handleClickShowPassword = () => setIsPasswordShown((show) => !show);
  const handleClickShowConfirmPassword = () => setIsConfirmPasswordShown((show) => !show);
  const onSubmit = () => toast.success("Form Submitted");

  return (
    <Card>
      <CardHeader title="New Admin Info" />
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={{ md: 6 }}>
            <Grid size={{ md: 6 }}>
              <Controller
                name="role_id"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    select
                    fullWidth
                    className="mb-4"
                    label="Role"
                    {...(errors.role_id && {
                      error: true,
                      helperText: errors.role_id.message,
                    })}
                  >
                    <MenuItem value="" selected>Select Role</MenuItem>
                    <MenuItem value="1">Admin</MenuItem>
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
                    placeholder="name"
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
                rules={{ required: true }}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    className="mb-4"
                    label="Password"
                    placeholder="············"
                    id="form-validation-scheme-password"
                    type={isPasswordShown ? "text" : "password"}
                    slotProps={{
                      input: {
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              edge="end"
                              onClick={handleClickShowPassword}
                              onMouseDown={(e) => e.preventDefault()}
                              aria-label="toggle password visibility"
                            >
                              <i
                                className={
                                  isPasswordShown
                                    ? "tabler-eye-off"
                                    : "tabler-eye"
                                }
                              />
                            </IconButton>
                          </InputAdornment>
                        ),
                      },
                    }}
                    {...(errors.password && {
                      error: true,
                      helperText: errors.password.message,
                    })}
                  />
                )}
              />

              <Controller
                name="confirm_password"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    className="mb-4"
                    label="Confirm Password"
                    placeholder="············"
                    id="form-validation-scheme-password-confirmed"
                    type={isConfirmPasswordShown ? "text" : "password"}
                    slotProps={{
                      input: {
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              edge="end"
                              onClick={handleClickShowConfirmPassword}
                              onMouseDown={(e) => e.preventDefault()}
                              aria-label="toggle password visibility"
                            >
                              <i
                                className={
                                  isConfirmPasswordShown
                                    ? "tabler-eye-off"
                                    : "tabler-eye"
                                }
                              />
                            </IconButton>
                          </InputAdornment>
                        ),
                      },
                    }}
                    {...(errors.confirm_password && {
                      error: true,
                      helperText: errors.confirm_password.message,
                    })}
                  />
                )}
              />

              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <FormControlLabel
                    control={<Checkbox {...field} />}
                    label="Active"
                  />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12 }} className="flex gap-4">
              <Button variant="contained" type="submit">
                Submit
              </Button>
              <Button
                variant="tonal"
                color="secondary"
                type="reset"
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
    </Card >
  );
};

export default UserCreateForm;
