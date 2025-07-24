"use client";

import { useState } from "react";


import { useParams } from 'next/navigation';
import Link from "next/link";

import { useSession } from "next-auth/react";


// MUI
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid2";
import Button from "@mui/material/Button";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";


// Components

// Form & Validation
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// Utils
import { toast } from "react-toastify";

import CustomTextField from "@core/components/mui/TextField";
import ConfirmDialog from "@components/dialogs/ConfirmDialog";
import EditDrawer from "./EditDrawer";

import pageApiHelper from "@/utils/pageApiHelper";
import { formattedDate } from "@/utils/formatters";

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

const FormList = ({ languageDropdown, languageList }) => {
  const params = useParams();
  const id = params.id;

  const [languages, setLanguages] = useState(languageList || []);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dialogOpen, setDialogOpen] = useState({ open: false, id: null });
  const [editDrawer, setEditDrawer] = useState(false);
  const [editingLag, setEditingLag] = useState(null);

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
      lagName: "",
      level: "",
    }
  });

  //from submission
  const { data: session } = useSession();
  const token = session?.accessToken;

  const onSubmit = async (formData) => {
    setIsSubmitting(true);

    try {
      const form = new FormData();

      form.append("languageId", formData.language);
      form.append("level", formData.level);

      const res = await pageApiHelper.post(`experts/${id}/attach/language`, form, token);

      const response = res?.data;
      const innerData = response?.data;

      if (!res?.success) {
        if (res?.status === 400) {
          let errors = innerData?.errors || [];

          if (errors) {
            Object.keys(errors).forEach(key => {
              setError(key, {
                type: "server",
                message: errors[key]
              });
            });

            toast.error(response?.message || "Something went wrong");
          }
        } else if (res?.status === 404) {
          toast.error(res?.data?.error || "Sorry! Expert not found");
        } else {
          toast.error(res?.data?.error || "Sorry! Error occurred");
        }

        return;
      }

      if (response?.success && innerData?.languages) {
        setLanguages(innerData.languages);
        resetForm({ language: "", level: "" });
        toast.success("Language updated successfully");
      }

    } catch (error) {
      toast.error(error.message || 'Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditLang = (lang) => {
    resetForm({ language: lang.id, lagName: lang.name, level: lang?.pivot?.level });

    setEditingLag(lang);
    setEditDrawer(true);
  };

  const handleEditSubmit = async (formData) => {
    if (!editingLag) {
      return
    }

    setIsSubmitting(true);

    try {
      const form = new FormData();

      form.append("languageId", formData.language);
      form.append("level", formData.level);

      const res = await pageApiHelper.put(`experts/${id}/lang-update`, form, token);

      const response = res?.data;
      const innerData = response?.data;

      if (!res?.success) {
        if (res?.status === 400) {
          let errors = innerData?.errors || [];

          if (errors) {
            Object.keys(errors).forEach(key => {
              setError(key, {
                type: "server",
                message: errors[key]
              });
            });

            toast.error(response?.message || "Something went wrong");
          }
        } else if (res?.status === 404) {
          toast.error(res?.data?.error || "Sorry! Expert not found");
        } else {
          toast.error(res?.data?.error || "Sorry! Error occurred");
        }

        return;
      }

      if (response?.success && innerData?.languages) {
        setLanguages(innerData.languages);
        handleDrawerClose();

        toast.success("Language added successfully");
      }

    } catch (error) {
      toast.error(error.message || 'Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDrawerClose = () => {
    setEditDrawer(false);
    resetForm({ language: "", lagName: "", level: "" });
  };

  const handleDelete = async (itemId) => {
    try {
      const form = new FormData();

      form.append("languageId", itemId);

      const res = await pageApiHelper.post(`experts/${id}/detach/language`, form, token);

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
            <Grid container spacing={{ md: 4 }}>
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
                      {languageDropdown?.map((lang) => (
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
                      placeholder="Level"
                      {...(errors.level && {
                        error: true,
                        helperText: errors.level.message,
                      })}
                    />
                  )}
                />
              </Grid>

              {/* Buttons */}
              <Grid size={12}>
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
          <Grid size={12}>
            <div className="w-full overflow-x-auto">
              <table className="w-full table-auto border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border px-4 py-2">Action</th>
                    <th className="border px-4 py-2">#</th>
                    <th className="border px-4 py-2">Name</th>
                    <th className="border px-4 py-2">Level</th>
                    <th className="border px-4 py-2">Created At</th>
                    <th className="border px-4 py-2">Updated At</th>
                  </tr>
                </thead>
                <tbody>
                  {languages?.map((lang, index) => (
                    <tr key={lang.id}>
                      <td className="border px-4 py-2 text-center">
                        <IconButton onClick={() => handleEditLang(lang)}>
                          <i className="tabler-edit text-primary" />
                        </IconButton>
                        <IconButton onClick={() => setDialogOpen({ open: true, id: lang.id })}>
                          <i className="tabler-trash text-error" />
                        </IconButton>
                      </td>
                      <td className="border px-4 py-2">{index + 1}</td>
                      <td className="border px-4 py-2">{lang.name}</td>
                      <td className="border px-4 py-2">{lang?.pivot?.level}</td>
                      <td className="border px-4 py-2">{formattedDate(lang?.pivot?.createdAt)}</td>
                      <td className="border px-4 py-2">{formattedDate(lang?.pivot?.updatedAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Grid>
        </CardContent>

        {/* Edit Drawer */}
        <EditDrawer
          open={editDrawer}
          onClose={handleDrawerClose}
          control={control}
          errors={errors}
          handleSubmit={handleSubmit}
          onSubmit={handleEditSubmit}
          isSubmitting={isSubmitting}
        />

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
