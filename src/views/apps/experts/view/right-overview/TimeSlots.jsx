import React, { useEffect, useState } from "react";

// MUI Imports
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid2";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import Collapse from "@mui/material/Collapse";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";

// Icons
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

// Utils
import { activeStatusLabel, activeStatusColor } from "@/utils/helpers";

const TimeSlots = ({ expertData }) => {
  const [availabilityGroups, setAvailabilityGroups] = useState([]);
  const [openDay, setOpenDay] = useState(null);

  useEffect(() => {
    if (expertData?.availabilities) {
      setAvailabilityGroups(expertData.availabilities);
    }
  }, [expertData]);

  const convertTo12Hour = (time24h) => {
    let [hours, minutes] = time24h.split(":");
    const modifier = +hours >= 12 ? "PM" : "AM";
    hours = +hours % 12 || 12;
    return `${hours}:${minutes} ${modifier}`;
  };

  

  
  return (
    <Card>
      <CardHeader title="Expert TimeSlots" />
      <CardContent>
        <Grid size={{ xs: 12 }}>
          <div className="w-full overflow-x-auto">
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell />
                    <TableCell>Day</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {availabilityGroups.map((group) => (
                    <React.Fragment key={group.dayOfWeek}>
                      <TableRow>
                        <TableCell>
                          <IconButton
                            onClick={() =>
                              setOpenDay(openDay === group.dayOfWeek ? null : group.dayOfWeek)
                            }
                          >
                            {openDay === group.dayOfWeek ? (
                              <KeyboardArrowUpIcon />
                            ) : (
                              <KeyboardArrowDownIcon />
                            )}
                          </IconButton>
                        </TableCell>
                        <TableCell>
                          {group.dayOfWeek.charAt(0).toUpperCase() + group.dayOfWeek.slice(1)}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell colSpan={3} style={{ padding: 0 }}>
                          <Collapse in={openDay === group.dayOfWeek} timeout="auto" unmountOnExit>
                            <Box margin={1}>
                              <Table size="small">
                                <TableHead>
                                  <TableRow>
                                  
                                    <TableCell>ID</TableCell>
                                    <TableCell>Start</TableCell>
                                    <TableCell>End</TableCell>
                                    <TableCell>Status</TableCell>
                                  </TableRow>
                                </TableHead>
                                <TableBody>
                                  {group.timeSlots?.map((slot) => (
                                    <TableRow key={slot.id}>
                                      
                                      <TableCell>{slot.id}</TableCell>
                                      <TableCell>{convertTo12Hour(slot.startTime)}</TableCell>
                                      <TableCell>{convertTo12Hour(slot.endTime)}</TableCell>
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
                      <TableCell colSpan={3} align="center">
                        No time slots available
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default TimeSlots;
