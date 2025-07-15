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
import shourovApiHelper from "@/utils/shourovApiHelper";

// Vars
const initialData = {
  name: "",
  active: true,
  isPopular: false,
  image: "",
};

// Add validation schema
const schema = z.object({
  name: z.string().min(1, "Name is required"),
  active: z.boolean().default(true),
  isPopular: z.boolean().default(false),
  image: z
    .any()
    .refine((file) => !file || (file instanceof FileList && file.length > 0), {
      message: "Image is required",
    })
    .refine(
      (file) =>
        !file ||
        (file instanceof FileList &&
          ["image/jpeg", "image/png", "image/svg+xml"].includes(file[0]?.type)),
      {
        message: "Only .jpg, .jpeg, .png, and .svg formats are supported",
      }
    ),
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
        isPopular: data?.isPopular,
        image: "",
      };

      setFormData(newFormData);
      resetForm(newFormData);
    } else {
      setFormData(initialData);
      resetForm(initialData);
    }

    if (data?.image) {
      setImagePreview(data.image);
    } else {
      setImagePreview(null);
    }
  }, [data, resetForm]);

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

  // form submission
  const onSubmit = async (formData) => {

    console.log(formData)
    setIsSubmitting(true);

    try {
      const form = new FormData();

      form.append("name", formData.name.trim());
      form.append("status", formData.active.toString());
      form.append("isPopular", formData.isPopular.toString());

      // Append image if exists
      if (formData.image?.[0]) {
        form.append("image", formData.image[0]);
      }

      let res, toastMessage;

      const headerConfig = {
        headers: {
          'Content-Type': 'multipart/form-data' 
        }
      };

      if (setType === 'edit') {
        res = await shourovApiHelper.put(`/api/category/${data.id}`, form, null, headerConfig);
        toastMessage = "Category updated successfully";
      } else {
        res = await shourovApiHelper.post('/api/category', form, null, headerConfig);
        toastMessage = "Category created successfully";
     

      }

      console.log(res)

      if (!res?.success && (res?.raw?.status === 400 || res?.status === 404)) {
        if (res?.status === 404) {
          toast.error("Category not found");

          return;

          
        } else if (res?.raw?.status === 400) {
    toast.error(res?.data?.message || "Invalid request format");
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

      if (res?.success && res?.data?.data?.success) {
        if (setType === 'edit') {
          const updatedData = userData.map(item =>
            item.id === res?.data?.data?.category?.id
              ? { ...item, ...res?.data?.data?.category }
              : item
          );

          setData(updatedData);
        } else {
          setData([res?.data?.data?.category, ...(userData ?? [])]);
        }

        handleClose();
        setFormData(initialData);
        setImagePreview(null);
        resetForm(initialData);


        // Reset file input
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }

      toast.success(toastMessage, { autoClose: 2000 });

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
        <Typography variant="h5">{setType == 'edit' ? 'Edit Category' : 'Add New Category'}</Typography>
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
                placeholder="Category name"
                {...(errors.name && {
                  error: true,
                  helperText: errors.name?.message || "This field is required.",
                })}
              />
            )}
          />

          <Controller
            name="image"
            control={control}
            render={({ field: { onChange, value, ...field } }) => (
              <div className="space-y-2">
                <CustomTextField
                  {...field}
                  type="file"
                  fullWidth
                  label="Upload Image"
                  variant="outlined"
                  size="small"
                  inputRef={fileInputRef}
                  inputProps={{
                    accept: "image/*",
                    onChange: (e) => handleImageChange(e.target.files, onChange),
                  }}
                  error={!!errors.image}
                  helperText={errors.image?.message}
                />
                {imagePreview && (
                  <div className="mt-2">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="max-h-[100px] rounded-md"
                    />
                  </div>
                )}
              </div>
            )}
          />

          <Grid container spacing={4}>
            <Grid size={{ xs: 6 }}>
              <Controller
                name="isPopular"
                control={control}
                render={({ field }) => {
                  return (
                    <FormControlLabel
                      control={
                        <Switch
                          color='success'
                          checked={Boolean(field.value)}
                          onChange={(e) => field.onChange(e.target.checked)}
                        />
                      }
                      label="Popular"
                    />
                  );
                }}
              />
            </Grid>
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
