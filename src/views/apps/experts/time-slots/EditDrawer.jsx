// MUI Imports
import Grid from "@mui/material/Grid2";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";

import { Controller } from "react-hook-form";

import CustomTextField from "@core/components/mui/TextField";
import AppReactDatepicker from "@/libs/styles/AppReactDatepicker";


const EditDrawer = (props) => {
  // Props
  const { weeks, open, onClose, control, errors, handleSubmit, onSubmit } = props;

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
        <Typography variant="h5">Edit Slot</Typography>
        <IconButton size="small" onClick={onClose}>
          <i className="tabler-x text-2xl text-textPrimary" />
        </IconButton>
      </div>
      <Divider />
      <div>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3 p-6">
          <Grid container spacing={4} sx={{ mt: 2 }}>
            <Controller
              name="dayOfWeek"
              control={control}
              render={({ field }) => (
                <CustomTextField
                  {...field}
                  select
                  fullWidth
                  label="Slot Day"
                  {...(errors.dayOfWeek && {
                    error: true,
                    helperText: errors.dayOfWeek.message,
                  })}
                >
                  <MenuItem value="" disabled>
                    Select a Day
                  </MenuItem>
                  {weeks.length > 0 && weeks.map((day) => (
                    <MenuItem key={day.key} value={day.key}>
                      {day.value}
                    </MenuItem>
                  ))}
                </CustomTextField>
              )}
            />

            <Grid container spacing={4}>
              <Grid size={{ md: 6 }}>
                <Controller
                  name="startTime"
                  control={control}
                  render={({ field }) => (
                    <AppReactDatepicker
                      showTimeSelect
                      showTimeSelectOnly
                      timeIntervals={15}
                      selected={field.value}
                      onChange={field.onChange}
                      dateFormat="h:mm aa"
                      customInput={<CustomTextField label="Start Time (GMT)" fullWidth />}
                    />
                  )}
                />
              </Grid>

              <Grid size={{ md: 6 }}>
                <Controller
                  name="endTime"
                  control={control}
                  render={({ field }) => (
                    <AppReactDatepicker
                      showTimeSelect
                      showTimeSelectOnly
                      timeIntervals={15}
                      selected={field.value}
                      onChange={field.onChange}
                      dateFormat="h:mm aa"
                      customInput={<CustomTextField label="End Time (GMT)" fullWidth />}
                    />
                  )}
                />
              </Grid>
            </Grid>
            {errors.startTime && (
              <p className="text-red-500 text-sm mt-1">{errors.startTime.message}</p>
            )}
          </Grid>

          {/* active status section  */}
          <Grid size={{ md: 4 }}>
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

          <Grid className="flex gap-3">
            <Button type="submit" variant="contained">
              Update
            </Button>
            <Button onClick={onClose} variant="tonal" color="error" sx={{ mr: 2 }}>
              Cancel
            </Button>
          </Grid>
        </form>
      </div>
    </Drawer>
  );
};

export default EditDrawer;
