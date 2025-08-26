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
  displayName: z
    .string()
    .min(1, "This field is required")
    .min(3, "Name must be at least 3 characters long"),

  status: z.boolean().default(true),
});

const EditForm = ({ role }) => {
  //console.log("edit roles",role)

  const router = useRouter();

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
      ...role,
    },
  });

  // form submission
  const onSubmit = async (formData) => {
    setIsSubmitting(true);

    try {
      const form = new FormData();

      form.append("displayName", formData.displayName.trim());
      form.append("status", formData.status.toString());

      const res = await pageApiHelper.put(`roles/${role.id}`, form, token);

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
        toast.success("Role updated successfully");

        // Optionally, redirect or perform other actions after successful creation
        router.push("/roles");
      }
    } catch (error) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader title="Edit Role Info" />
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
                href={"/roles"}
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
