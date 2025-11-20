// React Imports
import { useEffect, useRef, useState } from "react";

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
import { HexColorPicker } from "react-colorful";

import { useForm, Controller } from "react-hook-form";

// Zod Imports
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// Third-party Imports
import { toast } from "react-toastify";

import ProtectedRouteURL from "@/components/casl/ProtectedRoute";

import pageApiHelper from "@/utils/pageApiHelper";

// Component Imports
import CustomTextField from "@core/components/mui/TextField";

// Vars
const initialData = {
  title: "",
  subTitle: "",
  color: "#aabbcc",
  active: true,
  image: "",
};

// Add validation schema
const schema = z.object({
  title: z.string().min(1, "Title is required"),
  subTitle: z.string().min(1, "Sub title is required"),
  active: z.boolean().default(true),
  color: z.string().min(6, "Color code is required"),
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
      },
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
  const [colorCode, setColorCode] = useState("#aabbcc");

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
        title: data?.title || "",
        subTitle: data?.subTitle || "",
        color: data?.color || "",
        active: data?.status,
        image: "",
      };

      setFormData(newFormData);
      resetForm(newFormData);
      setColorCode(data?.color || "#aabbcc");
    } else {
      setFormData(initialData);
      resetForm(initialData);
      setColorCode("#aabbcc");
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
  const { data: session } = useSession();
  const token = session?.accessToken;

  const onSubmit = async (formData) => {
    setIsSubmitting(true);

    try {
      const form = new FormData();

      form.append("title", formData.title.trim());
      form.append("subTitle", formData.subTitle.trim());
      form.append("color", colorCode);
      form.append("status", formData.active.toString());

      // Append image if exists
      if (formData.image?.[0]) {
        form.append("image", formData.image[0]);
      }

      let response, toastMessage;

      const headerConfig = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };

      if (setType === "edit") {
        response = await pageApiHelper.put(
          `achievements/${data.id}`,
          form,
          token,
          headerConfig,
        );
        toastMessage = "Achievement updated successfully";
      } else {
        response = await pageApiHelper.post(
          "achievements",
          form,
          token,
          headerConfig,
        );
        toastMessage = "Achievement created successfully";
      }

      const res = response?.data;

      if (
        !response?.success &&
        (response?.status === 400 || response?.status === 404)
      ) {
        if (res?.status === 404) {
          toast.error("Achievement not found");

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
            item.id === res?.data?.achievement?.id
              ? { ...item, ...res?.data?.achievement }
              : item,
          );

          setData(updatedData);
        } else {
          setData([res?.data?.achievement, ...(userData ?? [])]);
        }

        handleClose();
        setFormData(initialData);
        setImagePreview(null);
        resetForm(initialData);

        // Reset file input
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }

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
    setImagePreview(null);
    resetForm(initialData);

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <ProtectedRouteURL actions={["create"]} subject="Achievement">

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
            {setType == "edit" ? "Edit Achievement" : "Add New Achievement"}
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
              name="title"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <CustomTextField
                  {...field}
                  fullWidth
                  label="Title"
                  placeholder="Achievement title"
                  {...(errors.title && {
                    error: true,
                    helperText:
                      errors.title?.message || "This field is required.",
                  })}
                />
              )}
            />

            <Controller
              name="subTitle"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <CustomTextField
                  {...field}
                  fullWidth
                  multiline
                  minRows={3}
                  label="Sub Title"
                  placeholder="Achievement sub title"
                  {...(errors.subTitle && {
                    error: true,
                    helperText:
                      errors.subTitle?.message || "This field is required.",
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
                      onChange: (e) =>
                        handleImageChange(e.target.files, onChange),
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

            <Controller
              name="color"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <>
                  <CustomTextField
                    {...field}
                    fullWidth
                    label="Color Code"
                    placeholder="Title text color"
                    value={colorCode}
                    onChange={(e) => {
                      field.onChange(e);
                      setColorCode(e.target.value);
                    }}
                    {...(errors.color && {
                      error: true,
                      helperText:
                        errors.color?.message || "This field is required.",
                    })}
                  />
                  <HexColorPicker
                    color={colorCode}
                    className="w-full"
                    onChange={setColorCode}
                  />
                </>
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
