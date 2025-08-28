"use client";

// React Imports
import { useRef, useState } from "react";

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

// Third-party Imports
import { toast } from "react-toastify";
import { Controller, useForm } from "react-hook-form";

// Components Imports
import { z } from "zod";

import { zodResolver } from "@hookform/resolvers/zod";

import { useSession } from "next-auth/react";

import CustomTextField from "@core/components/mui/TextField";

import pageApiHelper from "@/utils/pageApiHelper";

// Zod Imports
const schema = z.object({
  title: z
    .string({ message: "This field is required" })
    .min(1, "This field is required"),
  url: z
    .string({ message: "This field is required" })
    .min(1, "This field is required")
    .min(3, "User Name must be at least 3 characters long"),
  meta_title: z.string().nullable().default(""),
  detail: z
    .string({ message: "This field is required" })
    .trim()
    .min(1, "This field is required"),
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
  meta_og_image: z
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
  meta_description: z.string().nullable().default(""),
});

const AboutEditForm = ({ page }) => {
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
      ...page,
      image: "",
      meta_og_image: "",
    },
  });

  const fileInputRef = useRef(null);
  const [imagePreview, setImagePreview] = useState(null);

  const fileInputRefOg = useRef(null);
  const [imagePreviewOg, setImagePreviewOg] = useState(null);

  //handle change
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

  const handleImageChangeOg = (files, onChange) => {
    if (files?.[0]) {
      const reader = new FileReader();

      reader.onload = (e) => {
        setImagePreviewOg(e.target.result);
      };

      reader.readAsDataURL(files[0]);
    } else {
      setImagePreviewOg(null);
    }

    onChange(files);
  };

  // form submission

  const { data: session } = useSession();
  const token = session?.accessToken;

  const onSubmit = async (formData) => {
    setIsSubmitting(true);

    try {
      const form = new FormData();

      form.append("title", formData.title ? formData.title.trim() : "");
      form.append("url", formData.url ? formData.url.trim() : "");
      form.append("detail", formData.detail ? formData.detail.trim() : "");
      form.append(
        "meta_title",
        formData.meta_title ? formData.meta_title.trim() : "",
      );
      form.append("status", formData.status.toString());
      form.append(
        "meta_description",
        formData.meta_description ? formData.meta_description.trim() : "",
      );

      // Append image if exists
      if (formData.image?.[0]) {
        form.append("image", formData.image[0]);
      }

      if (formData.meta_og_image?.[0]) {
        form.append("meta_og_image", formData.meta_og_image[0]);
      }

      let res;

      const headerConfig = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };

      res = await pageApiHelper.put(
        `pages/${page.id}`,
        form,
        token,
        headerConfig,
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
        toast.success("Page updated successfully");

        // Optionally, redirect or perform other actions after successful creation
        router.push("/pages");
      }
    } catch (error) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader title="Update Page Info" />
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={{ md: 6 }}>
            <Grid size={{ md: 6 }}>
              <Controller
                name="title"
                control={control}
                rules={{ required: false }}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    value={field.value || ""}
                    fullWidth
                    className="mb-4"
                    label="Banner Title"
                    placeholder="Title"
                    {...(errors.title && {
                      error: true,
                      helperText: errors.title.message,
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
                      className="mb-4"
                      label="Banner Image"
                      variant="outlined"
                      size="small"
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
                name="detail"
                control={control}
                rules={{ required: false }}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    value={field.value || ""}
                    fullWidth
                    multiline
                    minRows={2}
                    className="mb-2"
                    label="Section top title"
                    placeholder="Detail"
                    {...(errors.detail && {
                      error: true,
                      helperText: errors.detail.message,
                    })}
                  />
                )}
              />

              <Controller
                name="meta_title"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    value={field.value || ""}
                    fullWidth
                    type="meta_title"
                    className="mb-4"
                    label="Meta Title"
                    placeholder="Meta title"
                    {...(errors.meta_title && {
                      error: true,
                      helperText: errors.meta_title.message,
                    })}
                  />
                )}
              />
            </Grid>

            <Grid size={{ md: 6 }}>
              <Controller
                name="meta_keywords"
                control={control}
                rules={{ required: false }}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    value={field.value || ""}
                    fullWidth
                    multiline
                    minRows={2}
                    className="mb-4"
                    label="Meta Keywords"
                    placeholder="Meta keywords"
                    {...(errors.meta_keywords && {
                      error: true,
                      helperText: errors.meta_keywords.message,
                    })}
                  />
                )}
              />

              <Controller
                name="meta_description"
                control={control}
                rules={{ required: false }}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    value={field.value || ""}
                    fullWidth
                    multiline
                    minRows={2}
                    className="mb-2"
                    label="Meta Description"
                    placeholder="Meta description"
                    {...(errors.meta_description && {
                      error: true,
                      helperText: errors.meta_description.message,
                    })}
                  />
                )}
              />

              <Controller
                name="meta_og_image"
                control={control}
                render={({ field: { onChange, value, ...field } }) => (
                  <div className="space-y-2">
                    <CustomTextField
                      {...field}
                      type="file"
                      fullWidth
                      className="mb-4"
                      label="Meta OG Image"
                      variant="outlined"
                      size="small"
                      inputRef={fileInputRefOg}
                      inputProps={{
                        accept: "image/*",
                        onChange: (e) =>
                          handleImageChangeOg(e.target.files, onChange),
                      }}
                      error={!!errors.meta_og_image}
                      helperText={errors.meta_og_image?.message}
                    />
                    {imagePreviewOg && (
                      <div className="mt-2">
                        <img
                          src={imagePreviewOg}
                          alt="Preview"
                          className="max-h-[50px] rounded-md"
                        />
                      </div>
                    )}
                  </div>
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
                color="error"
                component={Link}
                href={"/pages"}
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

export default AboutEditForm;
