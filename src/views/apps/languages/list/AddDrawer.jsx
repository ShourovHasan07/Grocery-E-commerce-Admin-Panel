// React Imports
import { useEffect, useState } from "react";

import { useSession } from "next-auth/react";

// MUI Imports
import Grid from "@mui/material/Grid2";
import Button from "@mui/material/Button";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";

import { useForm, Controller } from "react-hook-form";

// Zod Imports
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// Third-party Imports
import { toast } from "react-toastify";

import pageApiHelper from "@/utils/pageApiHelper";

// Component Imports
import CustomTextField from "@core/components/mui/TextField";
import ProtectedRouteURL from "@/components/casl component/ProtectedRoute";

// Vars
const initialData = {
  name: "",
  active: true,
};

// Add validation schema
const schema = z.object({
  name: z.string().min(1, "Name is required"),
  active: z.boolean().default(true),
});

const AddDrawer = (props) => {
  // Props
  const { drawerData, handleClose, userData, setData, setType } = props;

  const { data } = drawerData;

  // States
  const [formData, setFormData] = useState(initialData);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Hooks
  const {
    control,
    reset: resetForm,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: formData,
  });

  useEffect(() => {
    if (data && Object.keys(data).length > 0) {
      const newFormData = {
        name: data?.name || "",
        active: data?.status,
      };

      setFormData(newFormData);
      resetForm(newFormData);
    } else {
      setFormData(initialData);
      resetForm(initialData);
    }
  }, [data, resetForm]);

  // form submission

  const { data: session } = useSession();
  const token = session?.accessToken;

  const onSubmit = async (formData) => {
    setIsSubmitting(true);

    try {
      const form = new FormData();

      form.append("name", formData.name.trim());
      form.append("status", formData.active.toString());

      let response, toastMessage;

      const headerConfig = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };

      if (setType === "edit") {
        response = await pageApiHelper.put(
          `languages/${data.id}`,
          form,
          token,
          headerConfig,
        );
        toastMessage = "Language updated successfully";
      } else {
        response = await pageApiHelper.post(
          "languages",
          form,
          token,
          headerConfig,
        );
        toastMessage = "Language created successfully";
      }

      const res = response?.data;

      if (
        !response?.success &&
        (response?.status === 400 || response?.status === 404)
      ) {
        if (res?.status === 404) {
          toast.error("Language not found");

          return;
        }

        let errors = res?.data?.errors || [];

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

      if (res?.success && res?.data?.success) {
        if (setType === "edit") {
          const updatedData = userData.map((item) =>
            item.id === res?.data?.language?.id
              ? { ...item, ...res?.data?.language }
              : item,
          );

          setData(updatedData);
        } else {
          setData([res?.data?.language, ...(userData ?? [])]);
        }

        handleClose();
        setFormData(initialData);
        resetForm(initialData);

        toast.success(toastMessage);
      }
    } catch (error) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    handleClose();
    setFormData(initialData);
    resetForm(initialData);
  };

  return (


     <ProtectedRouteURL actions={["create"]} subject="Language">





    <Drawer
      open={drawerData.open}
      anchor="right"
      variant="temporary"
      onClose={handleReset}
      ModalProps={{ keepMounted: true }}
      sx={{ "& .MuiDrawer-paper": { width: { xs: 300, sm: 400 } } }}
    >
      <div className="flex items-center justify-between plb-5 pli-6">
        <Typography variant="h5">
          {setType == "edit" ? "Edit Language" : "Add New Language"}
        </Typography>
        <IconButton size="small" onClick={handleReset}>
          <i className="tabler-x text-2xl text-textPrimary" />
        </IconButton>
      </div>
      <Divider />
      <div>
        <form
          onSubmit={handleSubmit((data) => onSubmit(data))}
          className="flex flex-col gap-3 p-6"
        >
          <Controller
            name="name"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <CustomTextField
                {...field}
                fullWidth
                label="Name"
                placeholder="Language name"
                {...(errors.name && {
                  error: true,
                  helperText: errors.name?.message || "This field is required.",
                })}
              />
            )}
          />

          <Grid container spacing={4}>
            <Grid size={{ xs: 6 }}>
              <Controller
                name="active"
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
          </Grid>

          <div className="flex items-center gap-4">
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
              type="reset"
              onClick={handleReset}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </Drawer>

    </ProtectedRouteURL>


  );
};

export default AddDrawer;
