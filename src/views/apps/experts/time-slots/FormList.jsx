"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import DialogEdit from "./DialogEdit";
import DialogDelete from "./DialogDelete";




// MUI
import {
  Card, Button, CardHeader, CardContent, MenuItem,
  IconButton, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Box, Collapse
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import Grid from "@mui/material/Grid2";

// Form
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// Components
import AppReactDatepicker from "@/libs/styles/AppReactDatepicker";
import CustomTextField from "@core/components/mui/TextField";
import apiHelper from "@/utils/apiHelper";  
import { toast } from "react-toastify";

// Validation
const schema = z.object({
  timeDay: z.number().int().positive(),
  startTime: z.date(),
  endTime: z.date(),
});

// Get next 7 days
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

const FormList = ({ availabilityList }) => {  

  // States

  const [availabilityGroups, setAvailabilityGroups] = useState(availabilityList || []);
   const [openDay, setOpenDay] = useState(null);

  // DialogEdit  states
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editingSlotId, setEditingSlotId] = useState(null);

  //  Dialogdelet  states
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

 
  const { id } = useParams();


   // Form control
  const { control, reset, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      timeDay: "",
      startTime: "",
      endTime: "",
    },
  });



 
  // Open dialogEdit  and load data for editing
  const handleEditSlot = (slotId, dayOfWeek) => {
    const dayGroup = availabilityGroups.find((g) => g.dayOfWeek === dayOfWeek);
    const slot = dayGroup?.timeSlots.find((s) => s.id === slotId);
    const matchedDay = getNext7Days().find(
      (d) => d.name.toLowerCase() === dayOfWeek.toLowerCase()
    );

    if (slot && matchedDay) {
      // Reset form with existing slot data converted to Date objects
      reset({
        timeDay: matchedDay.id,
        startTime: new Date(`1970-01-01T${slot.startTime}`),
        endTime: new Date(`1970-01-01T${slot.endTime}`),
      });

      setEditMode(true);
      setEditingSlotId(slotId);
      setDialogOpen(true);
    }
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
    });
    setEditMode(false);
    setEditingSlotId(null);
  };


  // time helper  

  
 function convertTo12Hour(time24h) {
  let [hours, minutes] = time24h.split(":");
  const modifier = +hours >= 12 ? "PM" : "AM";

  hours = +hours % 12 || 12; // convert '00' to '12'

  return `${hours}:${minutes} ${modifier}`;
}







  // Submit handler
  const onSubmit = async (formData) => {
    const selectedDay = getNext7Days().find(day => day.id === formData.timeDay);
    if (!selectedDay) return;

    if (formData.endTime <= formData.startTime) {
      toast.error("End time must be after start time");
      return;
    }

    const form = new FormData();
    form.append("dayOfWeek", selectedDay.name.toLowerCase());
    form.append("startTime", formData.startTime.toTimeString().slice(0, 8));
    form.append("endTime", formData.endTime.toTimeString().slice(0, 8));
    form.append("status", "true");

  if (editMode && editingSlotId) {
  try {
    const res = await apiHelper.post(`experts/time-slot/${editingSlotId}/edit`, form);
     console.log("EDIT RESPONSE:", res);
     
    if (res?.data?.success && res?.data?.timeSlot) {

      const updatedSlot = res.data.timeSlot;

  setAvailabilityGroups((prevGroups) =>
    prevGroups.map((group) => {
      if (group.id === updatedSlot.expertAvailabilityId) {
        const updatedSlots = group.timeSlots.map((slot) => {
          if (slot.id === updatedSlot.id) {
            return {
              ...slot,
              startTime:updatedSlot.startTime,
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
}

    // ✅ Add Mode
    try {
      const res = await apiHelper.post(`experts/${id}/add/time-slot`, form);
      if (res?.success) {

        if(res?.data?.availabilities){
          setAvailabilityGroups(res.data.availabilities)
        }

        toast.success("Time slot added");
        reset();

        
      } 
    } catch (error) {
  
  const errMsg =
    error?.res?.data?.message || 
    error?.message ||                 
    "Server error occurred";

  toast.error(errMsg); 
}
  };

  // delete  Function 


      const confirmDeleteSlot = async () => {
  const { day, slotId } = deleteTarget;

  try {
    const res = await apiHelper.delete(`experts/time-slot/${slotId}/delete`);
    const data = res?.data || res;

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
                  name="timeDay"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <CustomTextField
                      {...field}
                      select
                      fullWidth
                      className="mb-4"
                      label="Slot Day"
                      {...(errors.timeDay && {
                        error: true,
                        helperText: errors.timeDay.message,
                      })}
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
                    customInput={<CustomTextField label="Start Time" fullWidth />}
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
                    customInput={<CustomTextField label="End Time" fullWidth />}
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
                  <TableCell />
                  <TableCell className="text-start">Day</TableCell>
                  
                </TableRow>
              </TableHead>
              <TableBody>
                {availabilityGroups.map((group) => (
                  <React.Fragment key={group.dayOfWeek}>
                    <TableRow>
                      <TableCell>
                        <IconButton onClick={() => setOpenDay(openDay === group.dayOfWeek ? null : group.dayOfWeek)}>
                          {openDay === group.dayOfWeek ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                        </IconButton>
                      </TableCell>
                      <TableCell>
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
                                  <TableCell>Action</TableCell>
                                  <TableCell>ID</TableCell>
                                  <TableCell>Start</TableCell>
                                  <TableCell>End</TableCell>
                                  <TableCell>Status</TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {group.timeSlots.map((slot) => (
                                  <TableRow key={slot.id}>

                                      <TableCell className="flex gap-4">
                                      <IconButton onClick={() => handleEditSlot(slot.id, group.dayOfWeek)}>
                                        <i className="tabler-edit text-primary" />
                                      </IconButton>
                                      <IconButton onClick={() => handleDeleteClick(group.day, slot.id)}>
                                        <i className="tabler-trash text-error" />
                                      </IconButton>

                                    </TableCell>
                                    <TableCell>{slot.id}</TableCell>
                                    <TableCell>{convertTo12Hour(slot.startTime)}</TableCell>
                                    <TableCell>{convertTo12Hour(slot.endTime)}</TableCell>
                                     <TableCell>{slot.status ? "Active" : "Inactive"}</TableCell>
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

         
      <DialogEdit
        open={dialogOpen}
        onClose={handleDialogClose}
        control={control}
        errors={errors}
        handleSubmit={handleSubmit}
        onSubmit={onSubmit}
      />



 {/* Dialog for Edit */}
      <DialogDelete
  open={deleteDialogOpen}
  onClose={() => setDeleteDialogOpen(false)}
  onConfirm={confirmDeleteSlot}
/>



    </>
  );
};

export default FormList;
