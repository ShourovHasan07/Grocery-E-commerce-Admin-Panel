"use client";

import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  
  MenuItem,
  Button,
  Box,
} from "@mui/material";
import { Controller } from "react-hook-form";
import AppReactDatepicker from "@/libs/styles/AppReactDatepicker";
import CustomTextField from "@core/components/mui/TextField";
import Grid from "@mui/material/Grid2";


const getNext7Days = () => {
  const days = [];
  const today = new Date();
  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    const formatted = date.toLocaleDateString("en-US", { weekday: "long" });
    days.push({ id: i + 1, name: formatted });
  }
  return days;
};

const DialogEdit = ({ open, onClose, control, errors, handleSubmit, onSubmit }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Edit Time Slot</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={4} sx={{ mt: 1 }}>
            <Grid size={{ md: 4 }}>
              <Controller
                name="timeDay"
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    select
                    fullWidth
                    label="Slot Day"
                    error={!!errors.timeDay}
                    helperText={errors.timeDay?.message}
                  >
                    <MenuItem value="" disabled>
                      Select a day
                    </MenuItem>
                    {getNext7Days().map((day) => (
                      <MenuItem key={day.id} value={day.id}>
                        {day.name}
                      </MenuItem>
                    ))}
                  </CustomTextField>
                )}
              />
            </Grid>
            <Grid size={{ md: 4 }}>
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
            <Grid size={{ md: 4 }}>
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
