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

// Utils
import { activeStatusLabel, activeStatusColor, timeFormat } from "@/utils/helpers";

const TimeSlots = ({ expertData }) => {
  const [openDay, setOpenDay] = useState(null);

  return (
    <Card>
      <CardHeader
        title="Expert Time Slots"
        className="pb-1"
      />
      <CardContent>
        <Grid size={{ xs: 12 }}>
          <div className="w-full overflow-x-auto">
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell colSpan={2} className="font-black text-[15px]">Day</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {expertData?.availabilities && expertData?.availabilities.length > 0 && expertData.availabilities.map((group) => (
                    <React.Fragment key={group.dayOfWeek}>
                      <TableRow>
                        <TableCell colSpan={2}>
                          <IconButton
                            className="mr-2"
                            onClick={() =>
                              setOpenDay(openDay === group.dayOfWeek ? null : group.dayOfWeek)
                            }
                          >
                            {openDay === group.dayOfWeek ? (
                              <i className="tabler-chevron-up" />
                            ) : (
                              <i className="tabler-chevron-down" />
                            )}
                          </IconButton>

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
                                    <TableCell>Start Time (GMT)</TableCell>
                                    <TableCell>End Time (GMT)</TableCell>
                                    <TableCell>Status</TableCell>
                                  </TableRow>
                                </TableHead>
                                <TableBody>
                                  {group.timeSlots?.map((slot) => (
                                    <TableRow key={slot.id}>
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
