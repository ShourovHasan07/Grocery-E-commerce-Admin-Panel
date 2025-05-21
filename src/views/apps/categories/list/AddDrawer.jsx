// React Imports
import { useState } from "react";

// MUI Imports
import Button from "@mui/material/Button";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";

// Third-party Imports
import { useForm, Controller } from "react-hook-form";

// Component Imports
import CustomTextField from "@core/components/mui/TextField";

// Vars
const initialData = {
  company: "",
  country: "",
  contact: "",
};

const AddDrawer = (props) => {
  // Props
  const { open, handleClose, userData, setData } = props;

  // States
  const [formData, setFormData] = useState(initialData);

  // Hooks
  const {
    control,
    reset: resetForm,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      username: "",
      email: "",
      role: "",
      plan: "",
      status: "",
    },
  });

  const onSubmit = (data) => {
    const newUser = {
      name: data.name,
      status: data.status,
    };

    setData([...(userData ?? []), newUser]);
    handleClose();
    setFormData(initialData);
    resetForm({
      name: "",
      status: "",
    });
  };

  const handleReset = () => {
    handleClose();
    setFormData(initialData);
  };

  return (
    <Drawer
      open={open}
      anchor="right"
      variant="temporary"
      onClose={handleReset}
      ModalProps={{ keepMounted: true }}
      sx={{ "& .MuiDrawer-paper": { width: { xs: 300, sm: 400 } } }}
    >
      <div className="flex items-center justify-between plb-5 pli-6">
        <Typography variant="h5">Add New Category</Typography>
        <IconButton size="small" onClick={handleReset}>
          <i className="tabler-x text-2xl text-textPrimary" />
        </IconButton>
      </div>
      <Divider />
      <div>
        <form
          onSubmit={handleSubmit((data) => onSubmit(data))}
          className="flex flex-col gap-6 p-6"
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
                  helperText: "This field is required.",
                })}
              />
            )}
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
