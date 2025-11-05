"use client";

// React Imports
import { useState } from "react";

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
import MenuItem from "@mui/material/MenuItem";

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
    .min(1, "This field is required")
    .min(3, "Name must be at least 3 characters long"),
  pageId: z
    .number({ message: "This field is required" })
    .int("Must be an integer")
    .min(1, "Please select a page"),
  status: z.boolean().default(true),
});

const EditForm = ({ data }) => {
  const { menuItem, pages } = data;

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
      ...menuItem,
    },
  });

  // form submission

  const { data: session } = useSession();
  const token = session?.accessToken;

  const onSubmit = async (formData) => {
    setIsSubmitting(true);

    try {
      const form = new FormData();

      form.append("title", formData.title.trim());
      form.append("pageId", formData.pageId.toString());
      form.append("status", formData.status.toString());

      const res = await pageApiHelper.put(
        `menus/${menuItem.menuId}/menu-items/${menuItem.id}`,
        form,
        token
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
        toast.success("Menu Item updated successfully");

        // Optionally, redirect or perform other actions after successful creation
        router.push(`/menus/${menuItem.menuId}/menu-items`);
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
          <Grid container spacing={{ md: 4 }}>
            <Grid size={{ md: 6 }}>
              <Controller
                name="title"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
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
                name="pageId"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    select
                    fullWidth
                    className="mb-4"
                    label="Page"
                    {...(errors.pageId && {
                      error: true,
                      helperText: errors.pageId.message,
                    })}
                  >
                    <MenuItem value={0}>
                      Select Page
                    </MenuItem>
                    {pages?.map((page) => (
                      <MenuItem key={page.id} value={page.id}>
                        {page.title}
                      </MenuItem>
                    ))}
                  </CustomTextField>
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
                href={`/menus/${menuItem.menuId}/menu-items`}
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
