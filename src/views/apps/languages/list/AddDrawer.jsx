// React Imports
import { useEffect, useRef, useState } from "react";

// MUI Imports
import Grid from "@mui/material/Grid2";
import Button from "@mui/material/Button";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Switch from '@mui/material/Switch'

import { useForm, Controller } from "react-hook-form";

// Zod Imports
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";


// Third-party Imports
import { toast } from "react-toastify";

import apiHelper from "@/utils/apiHelper";

// Component Imports
import CustomTextField from "@core/components/mui/TextField";

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

  // refs
  const fileInputRef = useRef(null);

  // States
  const [formData, setFormData] = useState(initialData);
  const [imagePreview, setImagePreview] = useState(null);
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
  const onSubmit = async (formData) => {
    setIsSubmitting(true);

    try {
      const form = new FormData();

      form.append("name", formData.name.trim());
      form.append("status", formData.active.toString());

      let res, toastMessage;

      const headerConfig = {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      };

      if (setType === 'edit') {
        res = await apiHelper.put(`languages/${data.id}`, form, null, headerConfig);
        toastMessage = "Language updated successfully";
      } else {
        res = await apiHelper.post('languages', form, null, headerConfig);
        toastMessage = "Language created successfully";
      }

      if (!res?.success && (res?.status === 400 || res?.status === 404)) {
        if (res?.status === 404) {
          toast.error("Language not found");

          return;
        }

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
        if (setType === 'edit') {
          const updatedData = userData.map(item =>
            item.id === res?.data?.language?.id
              ? { ...item, ...res?.data?.language }
              : item
          );

          setData(updatedData);
        } else {
          setData([res?.data?.language, ...(userData ?? [])]);
        }

        handleClose();
        setFormData(initialData);
        setImagePreview(null);
        resetForm(initialData);


        // Reset file input
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }

        toast.success(toastMessage);
      }

    } catch (error) {
      toast.error(error.message || 'Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    handleClose();
    setFormData(initialData);
    setImagePreview(null);
    resetForm(initialData);


    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Drawer
      open={drawerData.open}
      anchor="right"
      variant="temporary"
      onClose={handleReset}
      ModalProps={{ keepMounted: true }}
      sx={{ "& .MuiDrawer-paper": { width: { xs: 300, sm: 400 } } }}
    >
      <div className="flex items-center justify-between plb-5 pli-6">
        <Typography variant="h5">{setType == 'edit' ? 'Edit Language' : 'Add New Language'}</Typography>
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
                  <i className='tabler-rotate-clockwise-2 motion-safe:animate-spin' />
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
  );
};

export default AddDrawer;
