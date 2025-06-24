"use client";

import { useState } from "react";
import { useParams } from 'next/navigation';
import Link from "next/link";
import TextField from "@mui/material/TextField";

// MUI
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid2";
import Button from "@mui/material/Button";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";

// Form & Validation
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// Utils
import { toast } from "react-toastify";
import apiHelper from "@/utils/apiHelper";

// Components
import ConfirmDialog from "@components/dialogs/ConfirmDialog";
import CustomTextField from "@core/components/mui/TextField";

const schema = z.object({
  language: z
    .number({
      required_error: "Language is required"
    })
    .int("Must be an integer")
    .positive("Must be positive"),
    level: z
        .string()
        .min(1, "This field is required")
});

const FormList = ({ languageData, langulageList }) => {
  const [languages, setLanguages] = useState(langulageList || []);

  const params = useParams();
  const id = params.id;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dialogOpen, setDialogOpen] = useState({ open: false, id: null });

  const {
    control,
    reset: resetForm,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      language: "",
      level: "",
    }
  });

  const onSubmit = async (formData) => {
    console.log(id)
    setIsSubmitting(true);
    try {
      const form = new FormData();
      form.append("language", formData.language);
      form.append("level", formData.level);

      const res = await apiHelper.post(`experts/${id}/attach/language`, form);

      if (!res?.success) {
        if (res?.status === 400) {
          let errors = res?.data?.errors || [];
          if (errors) {
            Object.keys(errors).forEach(key => {
              setError(key, {
                type: "server",
                message: errors[key]
              });
            });
          }
        } else if (res?.status === 404) {
          toast.error(res?.data?.error || "Sorry! Expert not found");
        }
        return;
      }

      if (res?.data?.languages) {
        setLanguages(res.data.languages);
        resetForm({ language: "", level: "" });
        toast.success("Language added successfully");
      }

    } catch (error) {
      toast.error(error.message || 'Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (itemId) => {
    try {
      const form = new FormData();
      form.append("language", itemId);

      const res = await apiHelper.post(`experts/${id}/detach/language`, form);

      if (res?.success && res?.data?.success) {
        setLanguages(prevData => languages.filter((item) => item.id !== itemId));
        setDialogOpen({ open: false, id: null });
        toast.success("Deleted successfully");
        return;
      }

      toast.error(res?.data?.error || "Something went wrong while deleting");
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <>
      <Card className="mb-4">
        <CardHeader title="New Language Info" />
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={{ md: 6 }}>
              {/* Language Dropdown */}
              <Grid size={{ md: 6 }}>
                <Controller
                  name="language"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <CustomTextField
                      {...field}
                      select
                      fullWidth
                      className="mb-4"
                      label="Language"
                      {...(errors.language && {
                        error: true,
                        helperText: errors.language.message,
                      })}
                    >
                      <MenuItem value="" selected>Select Language</MenuItem>
                      {languageData?.map((lang) => (
                        <MenuItem key={lang.id} value={lang.id}>{lang.name}</MenuItem>
                      ))}
                    </CustomTextField>
                  )}
                />
              </Grid>

              <Grid size={{ md: 6 }}>
                <Controller
                name="level"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    className="mb-4"
                    label="Level"
                    placeholder="level"
                    {...(errors.level && {
                      error: true,
                      helperText: errors.level.message,
                    })}
                  />
                )}
              />
              </Grid>

              {/* Buttons */}
              <Grid xs={12}>
                <Button
                  variant="contained"
                  type="submit"
                  disabled={isSubmitting}
                  endIcon={isSubmitting ? <i className='tabler-rotate-clockwise-2 motion-safe:animate-spin' /> : null}
                >
                  Submit
                </Button>
                <Button
                  variant="tonal"
                  color="error"
                  component={Link}
                  href={"/experts"}
                  className="ml-4"
                >
                  Cancel
                </Button>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>

      {/* Existing Language List */}
      <Card className="mb-4">
        <CardHeader title="Language List" />
        <CardContent>
          <Grid item xs={12}>
            <div className="w-full overflow-x-auto">
              <table className="w-full table-auto border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border px-4 py-2">Action</th>
                    <th className="border px-4 py-2">#</th>
                    <th className="border px-4 py-2">Name</th>
                    <th className="border px-4 py-2">Level</th>
                  </tr>
                </thead>
                <tbody>
                  {languages?.map((lang, index) => (
                    <tr key={lang.id}>
                      <td className="border px-4 py-2 text-center">
                        <IconButton onClick={() => setDialogOpen({ open: true, id: lang.id })}>
                          <i className="tabler-trash text-error" />
                        </IconButton>
                      </td>
                      <td className="border px-4 py-2">{index + 1}</td>
                      <td className="border px-4 py-2">{lang.name}</td>
                      <td className="border px-4 py-2">{lang?.pivot?.level}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Grid>
        </CardContent>

        <ConfirmDialog
          dialogData={dialogOpen}
          handleCloseDialog={() => setDialogOpen({ open: false, id: null })}
          handleDelete={() => handleDelete(dialogOpen.id)}
        />
      </Card>
    </>
  );
};

export default FormList;
