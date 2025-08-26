// MUI Imports
import Grid from "@mui/material/Grid2";
import Button from "@mui/material/Button";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";

import { Controller } from "react-hook-form";

import CustomTextField from "@core/components/mui/TextField";

const EditDrawer = (props) => {
  // Props
  const {
    open,
    onClose,
    control,
    errors,
    handleSubmit,
    onSubmit,
    isSubmitting,
  } = props;

  return (
    <Drawer
      open={open}
      anchor="right"
      variant="temporary"
      onClose={onClose}
      ModalProps={{ keepMounted: true }}
      sx={{ "& .MuiDrawer-paper": { width: { xs: 300, sm: 400 } } }}
    >
      <div className="flex items-center justify-between plb-5 pli-6">
        <Typography variant="h5">Edit Language</Typography>
        <IconButton size="small" onClick={onClose}>
          <i className="tabler-x text-2xl text-textPrimary" />
        </IconButton>
      </div>
      <Divider />
      <div>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-3 p-6"
        >
          <Grid container spacing={4} sx={{ mt: 2 }}>
            <Controller
              name="lagName"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <CustomTextField
                  {...field}
                  fullWidth
                  disabled
                  className="mb-4"
                  label="Language"
                  placeholder="Language"
                  {...(errors.language && {
                    error: true,
                    helperText: errors.language.message,
                  })}
                />
              )}
            />

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

          <Grid className="flex gap-3">
            <Button
              type="submit"
              variant="contained"
              disabled={isSubmitting}
              endIcon={
                isSubmitting ? (
                  <i className="tabler-rotate-clockwise-2 motion-safe:animate-spin" />
                ) : null
              }
            >
              Update
            </Button>
            <Button
              onClick={onClose}
              variant="tonal"
              color="error"
              sx={{ mr: 2 }}
            >
              Cancel
            </Button>
          </Grid>
        </form>
      </div>
    </Drawer>
  );
};

export default EditDrawer;
