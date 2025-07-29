"use client";

import React, { useEffect, useState, useRef } from "react";


import Link from "next/link";
import { useParams } from "next/navigation";

import { useSession } from "next-auth/react";

import Chip from "@mui/material/Chip";

// API Helper

// MUI
import {
  Card, Button, CardHeader, CardContent, MenuItem,
  IconButton, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Box, Collapse
} from "@mui/material";
import Grid from "@mui/material/Grid2";

// Form
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// Components
import { toast } from "react-toastify";

import pageApiHelper from "@/utils/pageApiHelper";

import AppReactDatepicker from "@/libs/styles/AppReactDatepicker";
import CustomTextField from "@core/components/mui/TextField";

import DialogDelete from "./DialogDelete";
import EditDrawer from "./EditDrawer";

// Util Imports
import { activeStatusLabel, activeStatusColor, timeFormat } from "@/utils/helpers";

// Validation
const schema = z.object({
  dayOfWeek: z.string(),
  startTime: z.date(),
  endTime: z.date(),
  active: z.boolean().default(true),
});

const FormList = ({ weekDaysDropdown, availabilityList }) => {
  const { id: expertId } = useParams();

  // session
  const { data: session } = useSession();
  const token = session?.accessToken;

  const [availabilityGroups, setAvailabilityGroups] = useState(availabilityList || []);
  const [openDay, setOpenDay] = useState(null);

  // DialogEdit  states
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editingSlotId, setEditingSlotId] = useState(null);

  //  Dialog delete  states
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState({ day: null, slotId: null });


  // Refs to maintain latest values
  const editModeRef = useRef(editMode);
  const editingSlotIdRef = useRef(editingSlotId);

  // Sync refs with state
  useEffect(() => {
    editModeRef.current = editMode;
    editingSlotIdRef.current = editingSlotId;
  }, [editMode, editingSlotId]);


  // Form control
  const { control, reset, handleSubmit, formState: { errors }, setError } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      dayOfWeek: "",
      startTime: "",
      endTime: "",
      active: true,
    },
  });

  // Open dialogEdit  and load data for editing
  const handleEditSlot = (dayOfWeek, slot) => {
    reset({
      dayOfWeek: dayOfWeek,
      startTime: new Date(`1970-01-01T${slot.startTime}`),
      endTime: new Date(`1970-01-01T${slot.endTime}`),
      active: slot.status === true || slot.status === "true"
    });

    setEditMode(true);
    setEditingSlotId(slot.id);
    setDialogOpen(true);
  };

  //Open dialogDeleted  and load data for deleted
  const handleDeleteClick = (day, slotId) => {
    setDeleteTarget({ day, slotId });
    setDeleteDialogOpen(true);
  };


  // Close dialog and reset form
  const handleDialogClose = () => {
    setDialogOpen(false);
    reset({
      timeDay: "",
      startTime: null,
      endTime: null,
      active: true
    });
    setEditMode(false);
    setEditingSlotId(null);
  };

  //OnSubmit Handler
  const onSubmit = async (formData) => {

    if (formData.endTime <= formData.startTime) {
      toast.error("End time must be after start time");

      return;
    }

    const form = new FormData();

    form.append("dayOfWeek", formData.dayOfWeek.trim());
    form.append("startTime", formData.startTime.toTimeString().slice(0, 8));
    form.append("endTime", formData.endTime.toTimeString().slice(0, 8));
    form.append("status", formData.active);

    // edit api Call
    if (editMode && editingSlotId) {
      try {
        const res = await pageApiHelper.post(`experts/${expertId}/time-slots/${editingSlotId}/edit`, form, token);

        if (!res?.success && res?.status === 400) {

          let errors = res?.data?.data?.errors || [];

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

        if (res?.data?.data?.success && res?.data?.data?.timeSlot) {

          const updatedSlot = res.data.data.timeSlot;

          setAvailabilityGroups((prevGroups) =>
            prevGroups.map((group) => {
              if (group.id === updatedSlot.expertAvailabilityId) {
                const updatedSlots = group.timeSlots.map((slot) => {
                  if (slot.id === updatedSlot.id) {
                    return {
                      ...slot,
                      startTime: updatedSlot.startTime,
                      endTime: updatedSlot.endTime,
                      status: updatedSlot.status,
                      updatedAt: new Date().toISOString(),
                    };
                  }


                  return slot;
                });

                return {
                  ...group,
                  timeSlots: updatedSlots,
                };
              }


              return group;
            })
          );

          toast.success("Slot updated successfully!");
          handleDialogClose();
        }
        else {
          toast.error(res?.data?.errors?.startTime || "Update failed");
        }
      } catch (error) {
        toast.error("Error updating slot");
      }

      return;
    } else {
      // ✅ Add Mode
      try {
        const res = await pageApiHelper.post(`experts/${expertId}/time-slots/create`, form, token);


        if (!res?.success && res?.status === 400) {

          let errors = res?.data?.data?.errors || [];

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

        if (res?.success && res?.data?.data?.availabilities) {
          setAvailabilityGroups(res.data.data.availabilities)

          toast.success("Time slot added successfully");
          reset();
        }
      } catch (error) {

        const errMsg =
          error?.res?.data?.data?.message ||
          error?.message ||
          "Server error occurred";

        toast.error(errMsg);
      }
    }
  };

  // delete  Function
  const confirmDeleteSlot = async () => {
    const { day, slotId } = deleteTarget;

    try {
      const res = await pageApiHelper.delete(`experts/${expertId}/time-slots/${slotId}/delete`, token);

      const data = res?.data.data || res;

      if (data?.success) {
        toast.success("Slot deleted successfully!");

        // UI update or refetch
        setAvailabilityGroups((prev) =>
          prev
            .map((group) => {
              if (group.day === day) {
                return {
                  ...group,
                  timeSlots: group.timeSlots.filter((slot) => slot.id !== slotId),
                };
              }


              return group;
            })
            .filter((group) => group.timeSlots.length > 0)
        );
      } else {
        toast.error(data?.message || "Failed to delete slot");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Server error");
    } finally {
      setDeleteDialogOpen(false);
      setDeleteTarget({ day: null, slotId: null });
    }
  };


  return (
    <>
      {/* Time Slot Form */}
      <Card className="mb-4">
        <CardHeader title="Select Day Info" />
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={4}>

              {/* Select Day Dropdown */}
              <Grid size={{ md: 4 }}>
                <Controller
                  name="dayOfWeek"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <CustomTextField
                      {...field}
                      select
                      fullWidth
                      className="mb-4"
                      label="Slot Day"
                      {...(errors.dayOfWeek && {
                        error: true,
                        helperText: errors.dayOfWeek.message,
                      })}
                    >
                      <MenuItem value="" disabled>
                        Select a Day
                      </MenuItem>
                      {weekDaysDropdown.length > 0 && weekDaysDropdown.map((day) => (
                        <MenuItem className="capitalize" key={day.key} value={day.key}>
                          {day.value}
                        </MenuItem>
                      ))}

                    </CustomTextField>
                  )}
                />
              </Grid>

              {/* Start Time */}
              <Grid size={{ md: 4 }}>
                <Controller
                  name="startTime"
                  control={control}
                  render={({ field }) => (
                    <AppReactDatepicker
                      showTimeSelect
                      selected={field.value}
                      onChange={field.onChange}
                      timeIntervals={15}
                      showTimeSelectOnly
                      dateFormat="h:mm aa"
                      id="start-time-picker"
                      customInput={<CustomTextField label="Start Time (GMT)" fullWidth />}
                    />
                  )}
                />
                {errors.startTime && (
                  <p className="text-red-500 text-sm mt-1">{errors.startTime.message}</p>
                )}
              </Grid>

              {/* End Time */}
              <Grid size={{ md: 4 }}>
                <Controller
                  name="endTime"
                  control={control}
                  render={({ field }) => (
                    <AppReactDatepicker
                      showTimeSelect
                      selected={field.value}
                      onChange={field.onChange}
                      timeIntervals={15}
                      showTimeSelectOnly
                      dateFormat="h:mm aa"
                      id="end-time-picker"
                      customInput={<CustomTextField label="End Time (GMT)" fullWidth />}
                    />
                  )}
                />
                {errors.endTime && (
                  <p className="text-red-500 text-sm mt-1">{errors.endTime.message}</p>
                )}
              </Grid>


              {/* Submit and Cancel on New Line */}
              <Grid size={{ md: 12 }}>
                <Button type="submit" variant="contained">
                  Submit
                </Button>
                <Button
                  component={Link}
                  href="/experts"
                  variant="tonal"
                  color="error"
                  className="ml-4"
                >
                  Cancel
                </Button>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>

      {/* Time Slot Table */}
      <Card className="mb-4">
        <CardHeader title="Time Slots" />
        <CardContent>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell
                    align='left'
                    colSpan={2}
                    className="font-black text-[15px]"
                  >
                    Day & Slots
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {availabilityGroups.map((group) => (
                  <React.Fragment key={group.dayOfWeek}>
                    <TableRow>
                      <TableCell align='left' className="font-semibold text-sm capitalize">
                        <IconButton className="mr-1" onClick={() => setOpenDay(openDay === group.dayOfWeek ? null : group.dayOfWeek)}>
                          {openDay === group.dayOfWeek ? <i className="tabler-chevron-up" /> : <i className="tabler-chevron-down" />}
                        </IconButton>

                        {group.dayOfWeek ? group.dayOfWeek.charAt(0).toUpperCase() + group.dayOfWeek.slice(1).toLowerCase() : ""}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell colSpan={3} style={{ padding: 0 }}>
                        <Collapse in={openDay === group.dayOfWeek} timeout="auto" unmountOnExit>
                          <Box margin={1}>
                            <Table size="small">
                              <TableHead>
                                <TableRow>
                                  <TableCell className="w-[150px]">Action</TableCell>
                                  <TableCell>ID</TableCell>
                                  <TableCell>Start Time (GMT)</TableCell>
                                  <TableCell>End Time (GMT)</TableCell>
                                  <TableCell>Status</TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {group.timeSlots.map((slot) => (
                                  <TableRow key={slot.id}>
                                    <TableCell className="flex gap-4">
                                      <IconButton onClick={() => handleEditSlot(group.dayOfWeek, slot)}>
                                        <i className="tabler-edit text-primary" />
                                      </IconButton>
                                      <IconButton onClick={() => handleDeleteClick(group.day, slot.id)}>
                                        <i className="tabler-trash text-error" />
                                      </IconButton>
                                    </TableCell>
                                    <TableCell>{slot.id}</TableCell>
                                    <TableCell>{timeFormat(slot.startTime)}</TableCell>
                                    <TableCell>{timeFormat(slot.endTime)}</TableCell>
                                    <TableCell>
                                      <Chip
                                        variant="tonal"
                                        label={activeStatusLabel(slot.status)}
                                        size="small"
                                        color={activeStatusColor(slot.status)}
                                        className="capitalize"
                                      />
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </Box>
                        </Collapse>
                      </TableCell>
                    </TableRow>
                  </React.Fragment>
                ))}
                {availabilityGroups.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={3} align="center">No time slots available</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Edit Drawer */}
      <EditDrawer
        weeks={weekDaysDropdown}
        open={dialogOpen}
        onClose={handleDialogClose}
        control={control}
        errors={errors}
        handleSubmit={handleSubmit}
        onSubmit={onSubmit}
      />

      {/* Dialog for delete  */}
      <DialogDelete
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={confirmDeleteSlot}
      />

    </>
  );
};

export default FormList;
