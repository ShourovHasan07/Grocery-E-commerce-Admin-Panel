"use client";

// React Imports
import { useRef, useState } from "react";

import { useRouter } from 'next/navigation';
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

// Third-party Imports
import { toast } from "react-toastify";
import { Controller, useForm } from "react-hook-form";

// Components Imports
import { z } from "zod";

import { zodResolver } from "@hookform/resolvers/zod";

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

const CreateForm = () => {
  // States
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Hooks
  const router = useRouter();

  const {
    control,
    reset,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      displayName: "",
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

      form.append("displayName", formData.displayName.trim());
      form.append("status", formData.status.toString());

      const res = await pageApiHelper.post(`roles/create`, form, token);

      // console.log("create roles from res:", res);

      if (!res?.success && res?.status === 400) {

        let errors = res?.data?.errors || [];

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

      if (res?.success && res?.data?.success) {
        reset();
        toast.success("Role created successfully");

        // Optionally, redirect or perform other actions after successful creation
        router.push("/roles");
      }

    } catch (error) {
      toast.error(error.message || 'Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

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
                rules={{ required: true }}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    className="mb-4"
                    label="Name"
                    placeholder="Role name"
                    {...(errors.name && {
                      error: true,
                      helperText: errors.name.message,
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
                color="secondary"
                type="reset"
                onClick={reset}
                disabled={isSubmitting}
              >
                Reset
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

export default CreateForm;
