"use client";

// React Imports
import { useEffect, useRef, useState } from "react";

import { useParams , useRouter } from 'next/navigation';

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
import MenuItem from "@mui/material/MenuItem";

// Third-party Imports
import { toast } from "react-toastify";
import { Controller, useForm } from "react-hook-form";

// Components Imports
import { z } from "zod";

import { zodResolver } from "@hookform/resolvers/zod";

import CustomTextField from "@core/components/mui/TextField";

import apiHelper from "@/utils/apiHelper";

// Zod Imports

const schema = z.object({
  achievement: z
    .number()
    .int("Must be an integer")
    .positive("Must be positive"),
});

const Form = ({ achievementData }) => {
  // console.log(achievementData);
  const params = useParams();
  const id = params.id;

  // States
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Hooks
  const router = useRouter();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      achievement: "",
    }

  });


  // form submission
  const onSubmit = async (formData) => {
    setIsSubmitting(true);

    try {
      const form = new FormData();

      form.append("achievement", formData.achievement);


      let res;

      const headerConfig = {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      };

      res = await apiHelper.post(`experts/${id}/attach/achievement`, form, null, headerConfig);

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
        toast.success("Achievement Added successfully");
      }

    } catch (error) {
      toast.error(error.message || 'Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader title="New Achievement Info" />
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={{ md: 6 }}>
            <Grid size={{ md: 6 }}>
              <Controller
                name="achievement"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    select
                    fullWidth
                    className="mb-4"
                    label="Achievement"
                    {...(errors.achievement && {
                      error: true,
                      helperText: errors.achievement.message,
                    })}
                  >
                    <MenuItem value="" selected>Select Achievement</MenuItem>
                    {achievementData?.map((achievement) => (
                      <MenuItem key={achievement.id} value={achievement.id}>{achievement.title}</MenuItem>
                    ))}
                  </CustomTextField>
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

export default Form;
