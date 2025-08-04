"use client";

// React Imports
import { useEffect, useRef, useState } from "react";

import { useRouter } from 'next/navigation';
import Link from "next/link";

// MUI Imports
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid2";
import Button from "@mui/material/Button";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Chip from '@mui/material/Chip'

// Third-party Imports
import { toast } from "react-toastify";
import { Controller, useForm } from "react-hook-form";

// Components Imports
import { z } from "zod";

import { zodResolver } from "@hookform/resolvers/zod";

import { useSession } from "next-auth/react";

import CustomTextField from "@core/components/mui/TextField";
import CustomAutocomplete from '@core/components/mui/Autocomplete'

import pageApiHelper from "@/utils/pageApiHelper";

// Zod Imports

const schema = z.object({
  name: z
    .string()
    .min(1, "This field is required")
    .min(3, "Name must be at least 3 characters long"),
  email: z
    .string()
    .min(1, "This field is required")
    .email("Please enter a valid email address"),
  status: z.boolean().default(true),

});

const EditForm = ({ adminData }) => {
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
      ...adminData
    }

  });

  // form submission
  const onSubmit = async (formData) => {
    setIsSubmitting(true);

    try {
      const form = new FormData();

      form.append("name", formData.name.trim());
      form.append("email", formData.email.trim());
      form.append("status", formData.status.toString());

      let res;

      res = await pageApiHelper.put(`admins/${adminData.id}`, form, token);

      if (!res?.success && res?.status === 400) {

        let errors = res?.data?.data?.errors || [];

        if (errors) {
          Object.keys(errors).forEach(key => {
            setError(key, {
              type: "server",
              message: errors[key]
            });
          });
        }


        return;
      }

      if (res?.success && res?.data?.data?.success) {
        toast.success("admin updated successfully");

        // Optionally, redirect or perform other actions after successful creation
        router.push("/admins");
      }

    } catch (error) {
      toast.error(error.message || 'Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader title="Admin Info" />
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

            <Grid size={{ md: 6 }}>


            </Grid>

            <Grid size={{ xs: 12 }} className="flex gap-4">
              <Button
                variant="contained"
                type="submit"
                disabled={isSubmitting}
                endIcon={
                  isSubmitting ? (
                    <i className='tabler-rotate-clockwise-2 motion-safe:animate-spin' />
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
