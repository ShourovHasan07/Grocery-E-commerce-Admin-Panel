"use client";

import React from "react";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  MenuItem,
  Button,
  Box
} from "@mui/material";

import { Controller } from "react-hook-form";

import Grid from "@mui/material/Grid2";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";

import CustomTextField from "@core/components/mui/TextField";
import AppReactDatepicker from "@/libs/styles/AppReactDatepicker";

const DialogEdit = ({ weeks, open, onClose, control, errors, handleSubmit, onSubmit }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Edit Time Slot</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={4} sx={{ mt: 2 }}>
            <Grid size={{ md: 4 }}>
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
            </Grid>

            <Grid size={{ md: 8 }}>
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
                        customInput={<CustomTextField label="Start Time" fullWidth />}
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
                        customInput={<CustomTextField label="End Time" fullWidth />}
                      />
                    )}
                  />
                </Grid>
              </Grid>
              {errors.startTime && (
                <p className="text-red-500 text-sm mt-1">{errors.startTime.message}</p>
              )}
            </Grid>
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

          <Box display="flex" justifyContent="end" mt={4}>
            <Button onClick={onClose} variant="tonal" color="error" sx={{ mr: 2 }}>
              Cancel
            </Button>
            <Button type="submit" variant="contained">
              Update
            </Button>
          </Box>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default DialogEdit;
