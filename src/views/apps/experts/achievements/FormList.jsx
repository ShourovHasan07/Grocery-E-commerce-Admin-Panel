"use client";

// React Imports
import { useEffect, useRef, useState } from "react";

import { useParams, useRouter } from 'next/navigation';

import Link from "next/link";

// MUI Imports
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid2";
import Button from "@mui/material/Button";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import MenuItem from "@mui/material/MenuItem";

import IconButton from "@mui/material/IconButton";


// Util Imports

// Third-party Imports
import { toast } from "react-toastify";
import { Controller, useForm } from "react-hook-form";

// Components Imports
import { z } from "zod";

import { zodResolver } from "@hookform/resolvers/zod";

import { getInitials } from "@/utils/getInitials";
import ConfirmDialog from "@components/dialogs/ConfirmDialog";
import CustomAvatar from "@core/components/mui/Avatar";

import CustomTextField from "@core/components/mui/TextField";

import apiHelper from "@/utils/apiHelper";

// Zod Imports

const schema = z.object({
  achievement: z
    .number()
    .int("Must be an integer")
    .positive("Must be positive"),
});

const FormList = ({ achievementData, achievementList }) => {
  const [achievements, setAchievements] = useState(achievementList || []);

  // console.log(achievementData);
  const params = useParams();
  const id = params.id;

  // States
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [dialogOpen, setDialogOpen] = useState({
    open: false,
    id: null,
  });

  const {
    control,
    reset: resetForm,
    handleSubmit,
    formState: { errors },
    setError,
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

      const res = await apiHelper.post(`experts/${id}/attach/achievement`, form);

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

      if (res?.success && res?.data?.success) {
        if (res?.data?.achievements) {
          setAchievements(res.data.achievements);
        }

        resetForm({
          achievement: ""
        })

        toast.success("Achievement Added successfully");
      }

    } catch (error) {
      toast.error(error.message || 'Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getAvatar = (params) => {
    const { avatar, name } = params;

    if (avatar) {
      return <CustomAvatar src={avatar} size={50} />;
    } else {
      return <CustomAvatar size={50}>{getInitials(name)}</CustomAvatar>;
    }
  };

  const handleDelete = async (itemId) => {
    try {
      const form = new FormData();

      form.append("achievement", itemId);

      const res = await apiHelper.post(`experts/${id}/detach/achievement`, form);

      // Update the data state after successful deletion
      if (res?.success && res?.data?.success) {
        setAchievements(prevData => achievements.filter((item) => item.id !== itemId));

        setDialogOpen((prevState) => ({
          ...prevState,
          open: !prevState.open,
        }));

        toast.success("Deleted successfully");

        return
      }

      toast.error(res?.data?.error || "Something went wrong while deleting the achievement");
    } catch (error) {
      // Show error in toast
      toast.error(error.message)
    }
  };

  return (
    <>
      <Card className="mb-4">
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

      <Card className="mb-4">
        <CardHeader title="Achievement List" />
        <CardContent>
          <Grid size={{ xs: 12 }}>
            <div className="w-full overflow-x-auto">
              <table className="w-full table-auto border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border px-4 py-2">Action</th>
                    <th className="border px-4 py-2">#</th>
                    <th className="border px-4 py-2">Image</th>
                    <th className="border px-4 py-2">Title</th>
                    <th className="border px-4 py-2">Subtitle</th>
                  </tr>
                </thead>
                <tbody>
                  {achievements && achievements.map((achievement, index) => (
                    <tr key={index}>
                      <td className="border px-4 py-2 text-center">
                        <IconButton onClick={() => setDialogOpen((prevState) => ({
                          ...prevState,
                          open: !prevState.open,
                          id: achievement.id,
                        }))}
                        >
                          <i className="tabler-trash text-error" />
                        </IconButton>
                      </td>
                      <td className="border px-4 py-2">{index + 1}</td>
                      <td className="border px-4 py-2">
                        {getAvatar({
                          avatar: achievement.image,
                          name: achievement.title,
                        })}
                      </td>
                      <td className="border px-4 py-2">{achievement.title}</td>
                      <td className="border px-4 py-2">{achievement.subTitle}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Grid>
        </CardContent>

        <ConfirmDialog
          dialogData={dialogOpen}
          handleCloseDialog={() => setDialogOpen((prevState) => ({
            ...prevState,
            open: !prevState.open,
            id: null,
          }))}
          handleDelete={() => { handleDelete(dialogOpen.id); }}
        />
      </Card>
    </>
  );
};

export default FormList;
