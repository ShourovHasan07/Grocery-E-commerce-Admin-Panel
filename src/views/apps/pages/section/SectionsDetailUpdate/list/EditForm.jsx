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
  preTitle: z
    .string({ message: "This field is required" })
    .min(1, "This field is required")
    .min(3, "Name must be at least 3 characters long"),
  title: z.string().min(3, "Title must be at least 3 characters long"),
detail: z.string().min(1, "Detail is required"),
status: z.boolean(), 

  
  // hourlyRate: z
  //   .string()
  //   .min(1, "This field is required")
  //   .transform((val) => val === "" || val === undefined ? undefined : Number(val))
  //   .refine((val) => val === undefined || !isNaN(val), "Must be a valid number")
  //   .refine((val) => val === undefined || val >= 0, "Hourly rate must be a positive number"),
  
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
  
  
});

const EditForm = ({ pageSection }) => {

 



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
      ...pageSection,
      image: "",

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


      form.append("preTitle", formData.preTitle.trim());
      form.append("title", formData.title.trim());
      form.append("status", formData.status ? "true" : "false");

      form.append("detail", formData.detail.toString());
      

      

      // Append image if exists
              if (formData.image && formData.image.length > 0) {
          form.append("image", formData.image[0]);
        }


      let res;

      const headerConfig = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };

      res = await pageApiHelper.put(
        `pages/${pageSection.pageId}/sections/${pageSection.id}`,
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
        toast.success("Pages Sections  updated successfully");

        // Optionally, redirect or perform other actions after successful creation
        router.push(`/pages/${pageSection.pageId}/sections`);
      }
    } catch (error) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader title="Update Section  Info" />
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container>



            <Grid size={{ xs: 12 }} >










          


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



            <Controller
              name="preTitle"
              control={control}
              rules={{ required: false }}
              render={({ field }) => (
                <CustomTextField
                  {...field}
                  value={field.value ?? ""}
                  fullWidth
                  className="mb-4"
                  label="PreTitle"
                  placeholder="title"
                  {...(errors.phone && {
                    error: true,
                    helperText: errors.phone.message,
                  })}
                />
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
                  minRows={12}
                  className="mb-2 w-full "
                  label="Detail"
                  placeholder="About Me"
                  {...(errors.aboutMe && {
                    error: true,
                    helperText: errors.aboutMe.message,
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

export default EditForm;
