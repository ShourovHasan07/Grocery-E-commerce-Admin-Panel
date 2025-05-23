// React Imports
import { useEffect, useState } from "react";

// MUI Imports
import Button from "@mui/material/Button";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";

import { useForm, Controller } from "react-hook-form";


// Third-party Imports
import { toast } from "react-toastify";

import consola from "consola";

import apiHelper from "@/utils/apiHelper";

// Component Imports
import CustomTextField from "@core/components/mui/TextField";

// Vars
const initialData = {
  name: "",
  active: true,
  image: "",
};

const AddDrawer = (props) => {
  // Props
  const { drawerData, handleClose, userData, setData, setType } = props;

  const { data } = drawerData;

  // States
  const [formData, setFormData] = useState(initialData);

  // Hooks
  const {
    control,
    reset: resetForm,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm({
    defaultValues: formData,
  });

  useEffect(() => {
    if (data && Object.keys(data).length > 0) {
      const newFormData = {
        name: data?.name || "",
        active: data?.status,
        image: "",
      };

      setFormData(newFormData);
      resetForm(newFormData); // This will update the form fields
    } else {
      setFormData(initialData);
      resetForm(initialData);
    }
  }, [data, resetForm]);

  const onSubmit = async (formData) => {
    consola.log("Form data submitted:", formData);

    // Convert the active status to a string

    try {
      const createData = {
        name: formData.name.trim(),
        status: formData.active.toString(),
      };

      let res, toastMessage;

      if (setType === 'edit') {
        // call the edit API
        res = await apiHelper.put(`categories/${data.id}`, createData);
        toastMessage = "Category updated successfully";
      } else {
        // call the create API
        res = await apiHelper.post('categories', createData);
        toastMessage = "Category created successfully";
      }

      if (!res?.success && (res?.status === 400 || res?.status === 404)) {

        if (res?.status === 404) {
          toast.error("Category not found");

          return;
        }

        let errors = res?.data?.errors || [];

        if (errors) {
          Object.keys(errors).forEach(key => {
            setError(key, {
              type: "server",
              message: errors[key]
            })
          })
        }

        return;
      }


      // Update the data state after successful deletion
      if (res?.success && res?.data?.success) {
        if (setType === 'edit') {
          // update existing data
          const updatedData = userData.map(item =>
            item.id === res?.data?.category?.id
              ? { ...item, ...res?.data?.category }
              : item
          );

          setData(updatedData);
        } else {
          // Add the new category to the existing data
          setData([res?.data?.category, ...(userData ?? [])]);
        }

        handleClose();
        setFormData(initialData);
        resetForm({
          name: "",
          active: true,
          image: "",
        });

        toast.success(toastMessage);
      }

    } catch (error) {
      // console.error('Created failed:', error);

      // Show error in toast
      toast.error(error.message)
    }

  };

  const handleReset = () => {
    handleClose();
    setFormData(initialData);
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
            render={({ field }) => (
              <CustomTextField
                {...field}
                fullWidth
                label="Upload Image"
                variant="outlined"
                size="small"
                type="file"
                className="hidden"
              />
            )}
          />

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

          <div className="flex items-center gap-4">
            <Button variant="contained" type="submit">
              Submit
            </Button>
            <Button
              variant="tonal"
              color="error"
              type="reset"
              onClick={() => handleReset()}
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
