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



// Components Imports
import CustomTextField from "@core/components/mui/TextField";
import { useRouter } from 'next/navigation';

import { useSession } from "next-auth/react";


import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod"; // 
import pageApiHelper from "@/utils/pageApiHelper";



// Validation Schema
const schema = z
  .object({
    name: z.string().min(3, "Name must be at least 3 characters"),
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirm_password: z.string().min(6, "Confirm Password must be at least 6 characters"),
    status: z.boolean().default(true),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
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
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirm_password: "",
      status: true,
    },
  });






  //form submission
  const { data: session } = useSession();
  const token = session?.accessToken;

  const onSubmit = async (formData) => {

    // console.log (formData)


    setIsSubmitting(true);
    try {
      const form = new FormData();
      form.append("name", formData.name.trim());
      form.append("email", formData.email.trim());
      form.append("password", formData.password);
      form.append("status", formData.status.toString());



      const headerConfig = {
        headers: { "Content-Type": "multipart/form-data" },
      };

      const res = await pageApiHelper.post(`admins`, form, token, headerConfig);


      //console.log(res)

      if (!res?.success && res?.status === 400) {
        const errors = res?.data?.data?.errors || {};
        Object.keys(errors).forEach((key) => {
          setError(key, { type: "server", message: errors[key] });
        });
        return;
      }

      if (res?.success && res?.data?.success) {
        toast.success("Admin created successfully");
        reset();
        router.push("/admins");
      }
    } catch (error) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };







  return (
    <Card>
      <CardHeader title="New Admin Info" />
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

            </Grid>

            <Grid size={{ md: 6 }}>
              {/* <Controller
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
              /> */}

              <Controller
                name="password"
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    type={isPasswordShown ? "text" : "password"}
                    label="Password"
                    placeholder="Password"
                    error={!!errors.password}
                    helperText={errors.password?.message}
                    className="mb-4"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={() => setIsPasswordShown((prev) => !prev)}>
                            <i className={isPasswordShown ? "tabler-eye-off" : "tabler-eye"} />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
              />

              <Controller
                name="confirm_password"
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    type={isConfirmPasswordShown ? "text" : "password"}
                    label="Confirm Password"
                    placeholder="Confirm Password"
                    error={!!errors.confirm_password}
                    helperText={errors.confirm_password?.message}
                    className="mb-4"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={() => setIsConfirmPasswordShown((prev) => !prev)}>
                            <i className={isConfirmPasswordShown ? "tabler-eye-off" : "tabler-eye"} />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
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
                type="button"
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

export default CreateForm;
