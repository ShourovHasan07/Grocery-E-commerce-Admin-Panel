"use client";

import { useState } from "react";
import Link from "next/link";

// MUI Components
import Card from "@mui/material/Card";
import Grid from '@mui/material/Grid2';
; // <-- Correct import here
import Button from "@mui/material/Button";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";

// Form Libraries
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// Component Imports
import AppReactDatepicker from '@/libs/styles/AppReactDatepicker'
import CustomTextField from "@core/components/mui/TextField";

// ✅ Zod Validation Schema
const schema = z.object({
  timeDay: z
    .number({
      required_error: "Day is required",
    })
    .int("Must be an integer")
    .positive("Must be positive"),
  startTime: z.date({
    required_error: "Start time is required",
  }),
  endTime: z.date({
    required_error: "End time is required",
  }),
});




//   7 Days funtion

const getNext7Days = () => {
  const days = [];
  const today = new Date();
  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    const formatted = date.toLocaleDateString("en-US", {
      weekday: "long",
      
    });
    days.push({ id: i + 1, name: formatted });
  }
  return days;
};

const FormList = () => {
  const [timeDay, setTimeDay] = useState([]);
   const [time, setTime] = useState(new Date())
  const [dateTime, setDateTime] = useState(new Date())

  const {
    control,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      timeDay: "",
      startTime: "",
      endTime: "",
    },
  });

  const onSubmit = (formData) => {
    const selectedDay = getNext7Days().find((day) => day.id === formData.timeDay);
    const newEntry = {
      id: Date.now(),
      name: selectedDay?.name || "Unknown",
      startTime: formData.startTime,
      endTime: formData.endTime,
    };

    console.log (newEntry)



    setTimeDay((prev) => [...prev, newEntry]);
    reset();
  };

  const handleDelete = (itemId) => {
    setTimeDay((prev) => prev.filter((item) => item.id !== itemId));
  };

  return (
    <>
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

      {/* Table */}
      <Card className="mb-4">
        <CardHeader title="Selected Days Table" />
        <CardContent>
          <div className="w-full overflow-x-auto">
            <table className="w-full table-auto border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border px-4 py-2">Action</th>
                  <th className="border px-4 py-2">#</th>
                  <th className="border px-4 py-2">Day</th>
                  <th className="border px-4 py-2">Start Time</th>
                  <th className="border px-4 py-2">End Time</th>
                  <th className="border px-4 py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {timeDay.map((item, index) => (
                  <tr key={item.id}>
                    <td className="border px-4 py-2 text-center">
                      <IconButton onClick={() => handleDelete(item.id)}>
                        <i className="tabler-trash text-error" />
                      </IconButton>
                    </td>
                    <td className="border px-4 py-2">{index + 1}</td>
                    <td className="border px-4 py-2">{item.name}</td>
                    <td className="border px-4 py-2" >{item.startTime.toLocaleTimeString()}</td>
                    <td className="border px-4 py-2">{item.endTime.toLocaleTimeString()}</td>
                    <td className="border px-4 py-2">status</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default FormList;
