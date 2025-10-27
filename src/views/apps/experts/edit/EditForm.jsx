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
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Chip from "@mui/material/Chip";

// Third-party Imports
import { toast } from "react-toastify";
import { Controller, useForm } from "react-hook-form";

// Components Imports
import { z } from "zod";

import { zodResolver } from "@hookform/resolvers/zod";

import { useSession } from "next-auth/react";

import CustomTextField from "@core/components/mui/TextField";
import CustomAutocomplete from "@core/components/mui/Autocomplete";

import pageApiHelper from "@/utils/pageApiHelper";

// Zod Imports

const schema = z.object({
  name: z
    .string({ message: "This field is required" })
    .min(1, "This field is required")
    .min(3, "Name must be at least 3 characters long"),
  email: z
    .string({ message: "This field is required" })
    .min(1, "This field is required")
    .email("Please enter a valid email address"),
  userName: z
    .string({ message: "This field is required" })
    .min(1, "This field is required")
    .min(3, "User Name must be at least 3 characters long"),

  // hourlyRate: z
  //   .string()
  //   .min(1, "This field is required")
  //   .transform((val) => val === "" || val === undefined ? undefined : Number(val))
  //   .refine((val) => val === undefined || !isNaN(val), "Must be a valid number")
  //   .refine((val) => val === undefined || val >= 0, "Hourly rate must be a positive number"),
  // rating: z
  //   .string({ message: "This field is required" })
  //   .min(1, "This field is required")
  //   .transform((val) =>
  //     val === "" || val === undefined ? undefined : Number(val),
  //   )
  //   .refine((val) => val === undefined || !isNaN(val), "Must be a valid number")
  //   .refine(
  //     (val) => val === undefined || val >= 0,
  //     "Rating must be a positive number",
  //   )
  //   .refine((val) => val === undefined || val <= 5, "Rating must not exceed 5"),
  image: z
    .any()
    .refine((file) => !file || (file instanceof FileList && file.length > 0), {
      message: "Image is required",
    })
    .refine(
      (file) =>
        !file ||
        (file instanceof FileList &&
          ["image/jpeg", "image/png", "image/svg+xml"].includes(file[0]?.type)),
      {
        message: "Only .jpg, .jpeg, .png, and .svg formats are supported",
      },
    ),
  status: z.boolean().default(true),
  isVerified: z.boolean().default(false),
  phone: z.string().nullable().default(""),
  address: z.string().nullable().default(""),
  aboutMe: z.string().nullable().default(""),
  title: z.string().nullable().default(""),
  categories: z
    .array(
      z.object({
        id: z.number(),
        name: z.string(),
      }),
    )
    .default([]),
});

const EditForm = ({ expertData, categoryData }) => {
  // States
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Hooks
  const router = useRouter();

  const {
    control,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      ...expertData,
      image: "",
      categories:
        expertData.categories
          ?.filter((expertCat) =>
            categoryData.some(
              (availableCat) => availableCat.id === expertCat.id,
            ),
          )
          .map((cat) => ({
            id: cat.id,
            name: cat.name,
          })) || [],
    },
  });

  const handleImageChange = (files, onChange) => {
    if (files?.[0]) {
      const reader = new FileReader();

      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };

      reader.readAsDataURL(files[0]);
    } else {
      setImagePreview(null);
    }

    onChange(files);
  };

  const fileInputRef = useRef(null);
  const [imagePreview, setImagePreview] = useState(null);

  // form submission

  const { data: session } = useSession();
  const token = session?.accessToken;

  const onSubmit = async (formData) => {
    setIsSubmitting(true);

    try {
      const form = new FormData();

      form.append("name", formData.name.trim());
      form.append("email", formData.email.trim());
      form.append("userName", formData.userName.trim());
      form.append("status", formData.status.toString());
      form.append("isVerified", formData.isVerified.toString());
      form.append("phone", formData.phone ? formData.phone.trim() : "");
      form.append("address", formData.address ? formData.address.trim() : "");
      form.append("aboutMe", formData.aboutMe ? formData.aboutMe.trim() : "");
      form.append("title", formData.title ? formData.title.trim() : "");

      // form.append("hourlyRate", formData.hourlyRate);
      // form.append("rating", formData.rating);

      // Append image if exists
      if (formData.image?.[0]) {
        form.append("image", formData.image[0]);
      }

      formData.categories.forEach((category, index) => {
        form.append(`categories[${index}]`, category.id);
      });

      let res;

      const headerConfig = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };

      res = await pageApiHelper.put(
        `experts/${expertData.id}/edit`,
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
        toast.success("Expert updated successfully");

        // Optionally, redirect or perform other actions after successful creation
        router.push("/experts");
      }
    } catch (error) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader title="Update Expert Info" />
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
                    value={field.value ?? ""}
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
                    value={field.value ?? ""}
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

              <Controller
                name="userName"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    value={field.value ?? ""}
                    className="mb-4"
                    label="User Name"
                    placeholder="User name"
                    {...(errors.userName && {
                      error: true,
                      helperText: errors.userName.message,
                    })}
                  />
                )}
              />

              <Controller
                name="image"
                control={control}
                render={({ field: { onChange, value, ...field } }) => (
                  <div className="space-y-2">
                    <CustomTextField
                      {...field}
                      type="file"
                      fullWidth
                      label="Upload Image"
                      variant="outlined"
                      size="small"
                      className="mb-4"
                      inputRef={fileInputRef}
                      inputProps={{
                        accept: "image/*",
                        onChange: (e) =>
                          handleImageChange(e.target.files, onChange),
                      }}
                      error={!!errors.image}
                      helperText={errors.image?.message}
                    />
                    {imagePreview && (
                      <div className="mt-2">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="max-h-[50px] rounded-md"
                        />
                      </div>
                    )}
                  </div>
                )}
              />

              <Controller
                name="phone"
                control={control}
                rules={{ required: false }}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    value={field.value ?? ""}
                    fullWidth
                    className="mb-4"
                    label="Phone"
                    placeholder="phone"
                    {...(errors.phone && {
                      error: true,
                      helperText: errors.phone.message,
                    })}
                  />
                )}
              />

              <Controller
                name="address"
                control={control}
                rules={{ required: false }}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    value={field.value ?? ""}
                    fullWidth
                    className="mb-4"
                    label="Address"
                    placeholder="address"
                    {...(errors.address && {
                      error: true,
                      helperText: errors.address.message,
                    })}
                  />
                )}
              />
            </Grid>

            <Grid size={{ md: 6 }}>
              <Controller
                name="title"
                control={control}
                rules={{ required: false }}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    value={field.value ?? ""}
                    fullWidth
                    className="mb-4"
                    label="Title"
                    placeholder="title"
                    {...(errors.title && {
                      error: true,
                      helperText: errors.title.message,
                    })}
                  />
                )}
              />

              <Grid container spacing={2}>
                {/* <Grid size={{ md: 6 }}>
                  <Controller
                    name="hourlyRate"
                    control={control}
                    rules={{ required: false }}
                    render={({ field }) => (
                      <CustomTextField
                        {...field}
                        fullWidth
                        className="mb-4"
                        label="Hourly Rate (min 0)"
                        placeholder="hourly rate"
                        type="number"
                        inputProps={{
                          min: 0,
                          step: 0.5
                        }}
                        {...(errors.hourlyRate && {
                          error: true,
                          helperText: errors.hourlyRate.message,
                        })}
                      />
                    )}
                  />
                </Grid> */}

                {/* <Grid size={{ md: 12 }}>
                  <Controller
                    name="rating"
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <CustomTextField
                        {...field}
                        fullWidth
                        className="mb-4"
                        label="Rating Out of 5"
                        placeholder="Enter rating (0-5)"
                        type="number"
                        inputProps={{
                          min: 0,
                          max: 5,
                          step: 0.1,
                        }}
                        {...(errors.rating && {
                          error: true,
                          helperText: errors.rating.message,
                        })}
                      />
                    )}
                  />
                </Grid> */}
              </Grid>

              <Controller
                name="categories"
                control={control}
                render={({ field }) => (
                  <CustomAutocomplete
                    {...field}
                    multiple
                    options={categoryData || []}
                    id="categories"
                    className="mb-4"
                    getOptionLabel={(option) => option.name || ""}
                    renderInput={(params) => (
                      <CustomTextField
                        {...params}
                        label="Categories"
                        placeholder="Select categories"
                        error={!!errors.categories}
                        helperText={errors.categories?.message}
                      />
                    )}
                    renderTags={(catValue, getCatProps) =>
                      catValue.map((option, index) => (
                        <Chip
                          label={option.name}
                          {...getCatProps({ index })}
                          key={option.id}
                          size="small"
                        />
                      ))
                    }
                    onChange={(_, value) => field.onChange(value)}
                    value={field.value || []}
                    isOptionEqualToValue={(option, value) =>
                      option.id === value.id
                    }
                  />
                )}
              />

              <Controller
                name="aboutMe"
                control={control}
                rules={{ required: false }}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    value={field.value || ""}
                    fullWidth
                    multiline
                    minRows={6}
                    className="mb-2"
                    label="About Me"
                    placeholder="About Me"
                    {...(errors.aboutMe && {
                      error: true,
                      helperText: errors.aboutMe.message,
                    })}
                  />
                )}
              />

              <div className="flex items-center gap-2">
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

                <Controller
                  name="isVerified"
                  control={control}
                  render={({ field }) => {
                    return (
                      <FormControlLabel
                        control={
                          <Checkbox
                            color="success"
                            checked={Boolean(field.value)}
                            onChange={(e) => field.onChange(e.target.checked)}
                          />
                        }
                        label="Verified"
                      />
                    );
                  }}
                />
              </div>
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
                color="error"
                component={Link}
                href={"/experts"}
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
