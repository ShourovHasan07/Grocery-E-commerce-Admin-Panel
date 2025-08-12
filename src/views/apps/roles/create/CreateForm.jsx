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
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Chip from '@mui/material/Chip'

// Third-party Imports
import { toast } from "react-toastify";
import { Controller, useForm } from "react-hook-form";

// Components Imports
import { z } from "zod";

import { zodResolver } from "@hookform/resolvers/zod";

import CustomTextField from "@core/components/mui/TextField";
import CustomAutocomplete from '@core/components/mui/Autocomplete'

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
  const [isPasswordShown, setIsPasswordShown] = useState(false);
  const [isConfirmPasswordShown, setIsConfirmPasswordShown] = useState(false);
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
      name: "",
      displayName: "",
      status: true,
     
    },
  });

  const handleClickShowPassword = () => setIsPasswordShown((show) => !show);
  const handleClickShowConfirmPassword = () => setIsConfirmPasswordShown((show) => !show);

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

  //form submission
  const { data: session } = useSession();
  const token = session?.accessToken;

  const onSubmit = async (formData) => {
    setIsSubmitting(true);

    try {
      const form = new FormData();

     
      form.append("displayName", formData.displayName.trim());
    
      form.append("status", formData.status.toString());



      
     

      //let res;

      const headerConfig = {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      };

      const res = await pageApiHelper.post(`roles/create`, form, token, headerConfig);

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
        handleReset();
        toast.success("roles created successfully");

        // Optionally, redirect or perform other actions after successful creation
        router.push("/roles/show-list");
      }

    } catch (error) {
      toast.error(error.message || 'Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setImagePreview(null);
    reset();


    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Card>
      <CardHeader title="New roles Info" />
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
                    label="displayName"
                    placeholder="name"
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
                onClick={handleReset}
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
