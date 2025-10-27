"use client";

// React Imports
import { useState } from "react";

import { useParams } from "next/navigation";

import Link from "next/link";

import { useSession } from "next-auth/react";

// MUI Imports
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid2";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import Tooltip from "@mui/material/Tooltip";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";

// Third-party Imports
import { toast } from "react-toastify";

import Chip from "@mui/material/Chip";

import ConfirmDialog from "./ConfirmDialog";

import {
  activeStatusLabel,
  activeStatusColor,
} from "@/utils/helpers";

import pageApiHelper from "@/utils/pageApiHelper";

import { formattedDate } from "@/utils/formatters";

const FormList = ({ reviewsList, setExpertData }) => {
  const params = useParams();
  const id = params.id;

  // States
  const [reviews, setReviews] = useState(reviewsList);

  const [dialogOpen, setDialogOpen] = useState({
    open: false,
    id: null,
  });

  // form submission
  const { data: session } = useSession();
  const token = session?.accessToken;

  const handleChange = async (itemId) => {
    try {

      const res = await pageApiHelper.post(
        `experts/${id}/reviews`,
        {
          reviewId: itemId,
        },
        token,
      );

      // Update the data state after successful deletion
      if (res?.success && res?.data?.success) {
        setReviews(res?.data?.reviews || []);

        if (res?.data?.expert) {
          setExpertData(res?.data?.expert);
        }

        setDialogOpen((prevState) => ({
          ...prevState,
          open: !prevState.open,
        }));

        toast.success("Review status changed successfully");

        return;
      }

      toast.error(
        res?.data?.error ||
        "Something went wrong while changing the review status",
      );
    } catch (error) {
      // Show error in toast
      toast.error(error.message);
    }
  };

  return (
    <Card className="mb-4">
      <div className="flex items-center justify-between px-6 pt-6">
        <h2 className="text-lg font-semibold">Reviews List</h2>
        <Button
          variant="tonal"
          color="error"
          component={Link}
          href={"/experts"}
        >
          Experts
        </Button>
      </div>

      <CardContent>
        <Grid size={{ xs: 12 }}>
          <div className="w-full overflow-x-auto">
            <table className="w-full table-auto border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border px-4 py-2">Action</th>
                  <th className="border px-4 py-2">#</th>
                  <th className="border px-4 py-2">Status</th>
                  <th className="border px-4 py-2">Booking</th>
                  <th className="border px-4 py-2">Client</th>
                  <th className="border px-4 py-2">Rating</th>
                  <th className="border px-4 py-2">Review</th>
                  <th className="border px-4 py-2">Created At</th>
                  <th className="border px-4 py-2">Updated At</th>
                </tr>
              </thead>
              <tbody>
                {reviews &&
                  reviews.map((review, index) => (
                    <tr key={index}>
                      <td className="border px-4 py-2 text-center">
                        <Tooltip title="Change Status" arrow placement="top">
                          <IconButton
                            onClick={() =>
                              setDialogOpen((prevState) => ({
                                ...prevState,
                                open: !prevState.open,
                                id: review.id,
                              }))
                            }
                          >
                            <i className="tabler-eye-star text-primary" />
                          </IconButton>
                        </Tooltip>
                      </td>
                      <td className="border px-4 py-2">{index + 1}</td>
                      <td className="border px-4 py-2 text-center">
                        <Chip
                          variant="tonal"
                          label={activeStatusLabel(review.status)}
                          size="small"
                          color={activeStatusColor(review.status)}
                          className="capitalize"
                        />
                      </td>
                      <td className="border px-4 py-2">{review?.booking?.sessionTitle}</td>
                      <td className="border px-4 py-2">{review?.user?.name}</td>
                      <td className="border px-4 py-2 text-center">
                        {review.rating}
                      </td>
                      <td className="border px-4 py-2 text-wrap w-[400px]">
                        {review.review}
                      </td>
                      <td className="border px-4 py-2">
                        {formattedDate(review.createdAt)}
                      </td>
                      <td className="border px-4 py-2">
                        {formattedDate(review.updatedAt)}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </Grid>
      </CardContent>

      <ConfirmDialog
        dialogData={dialogOpen}
        handleCloseDialog={() =>
          setDialogOpen((prevState) => ({
            ...prevState,
            open: !prevState.open,
            id: null,
          }))
        }
        handleChange={() => {
          handleChange(dialogOpen.id);
        }}
      />
    </Card>
  );
};

export default FormList;
