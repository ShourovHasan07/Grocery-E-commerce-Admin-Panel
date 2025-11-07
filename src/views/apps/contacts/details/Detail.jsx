"use client";
import { useState } from "react";

// MUI Imports
import { useRouter } from "next/navigation";

import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid2";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Button from "@mui/material/Button";

import { useSession } from "next-auth/react";

import { toast } from "react-toastify";

import { Controller, useForm } from "react-hook-form";

import { z } from "zod";

import { zodResolver } from "@hookform/resolvers/zod";

import CustomTextField from "@core/components/mui/TextField";

import { contactStatusLabel, contactStatusColor } from "@/utils/helpers";
import { formattedDate } from "@/utils/formatters";
import NotFound from "@/components/NotFound";
import Link from "@/components/Link";

// Third-party Imports

// Components Imports


import pageApiHelper from "@/utils/pageApiHelper";

// Zod Imports
const schema = z.object({
  remark: z
    .string({ message: "This field is required" })
    .min(1, "This field is required")
});

const DetailInfo = ({ contact }) => {
  // Hooks
  const router = useRouter();

  const {
    control,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      remark: "",
    },
  });

  //form submission
  const { data: session } = useSession();
  const token = session?.accessToken;
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (formData) => {
    setIsSubmitting(true);

    try {
      const form = new FormData();

      form.append("remark", formData.remark.trim());

      const res = await pageApiHelper.put(
        `contacts/${contact.id}`,
        form,
        token,
      );

      if (!res?.success && res?.status === 400) {
        let errors = res?.data?.errors || [];

        if (errors) {
          Object.keys(errors).forEach((key) => {
            setError(key, {
              type: "server",
              message: errors[key],
            });
          });
        }

        return;
      }

      if (res?.success && res?.data?.success) {
        toast.success("Contact marked as solved successfully");

        // Optionally, redirect or perform other actions after successful creation
        router.push("/contacts");
      }
    } catch (error) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };



  // if 404
  const isContactInvalid =
    !contact ||
    typeof contact !== "object" ||
    contact === null ||
    Array.isArray(contact) ||
    Object.keys(contact).length === 0;

  if (isContactInvalid) {
    return (
      <NotFound
        title="Contact Not Found"
        message="Sorry, we could not find the contact you requested."
        buttonLabel="Back to contact List"
        redirectPath="/contacts"
      />
    );
  }

  return (
    <>
      <Card className="mb-4">
        <div className="flex p-6 justify-between items-center">
          <CardHeader className="p-0" title="Contact Detail Info" />

          <div>
            <Button
              variant="tonal"
              color="error"
              component={Link}
              href={"/contacts"}
            >
              Back
            </Button>
          </div>
        </div>

        <CardContent className="pt-0">
          <Grid size={{ xs: 12 }}>
            <div className="w-full overflow-x-auto">
              <table className="w-full table-auto border-collapse">
                <tbody>
                  <tr className="text-left">
                    <th className="border px-4 py-2 w-1/5">ID</th>
                    <td className="border px-4 py-2 w-4/5">{contact.id}</td>
                  </tr>
                  <tr className="text-left">
                    <th className="border px-4 py-2 w-1/5 align-top">Name</th>
                    <td className="border px-4 py-2 w-4/5">{contact.name}</td>
                  </tr>
                  <tr className="text-left">
                    <th className="border px-4 py-2 w-1/5">Email</th>
                    <td className="border px-4 py-2 w-4/5">{contact.email}</td>
                  </tr>
                  <tr className="text-left">
                    <th className="border px-4 py-2 w-1/5">Phone</th>
                    <td className="border px-4 py-2 w-4/5">{contact.phone}</td>
                  </tr>
                  <tr className="text-left">
                    <th className="border px-4 py-2 w-1/5">Subject</th>
                    <td className="border px-4 py-2 w-4/5">{contact?.subject.title || ''}</td>
                  </tr>
                  <tr className="text-left">
                    <th className="border px-4 py-2 w-1/5">Message</th>
                    <td className="border px-4 py-2 w-4/5">{contact.message}</td>
                  </tr>
                  <tr className="text-left">
                    <th className="border px-4 py-2 w-1/5">Attachment</th>
                    <td className="border px-4 py-2 w-4/5">
                      {contact.attachment && (
                        <Link
                          href={contact.attachment}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600"
                        >
                          {contact.attachment_file_or_name}
                        </Link>
                      )}
                    </td>
                  </tr>
                  <tr className="text-left">
                    <th className="border px-4 py-2 w-1/5">Status</th>
                    <td className="border px-4 py-2 w-4/5">
                      <Chip
                        variant="tonal"
                        label={contactStatusLabel(contact.status)}
                        size="small"
                        color={contactStatusColor(contact.status)}
                        className="capitalize"
                      />
                    </td>
                  </tr>
                  <tr className="text-left">
                    <th className="border px-4 py-2 w-1/5">Remark</th>
                    <td className="border px-4 py-2 w-4/5">{contact.remark}</td>
                  </tr>
                  <tr className="text-left">
                    <th className="border px-4 py-2 w-1/5">CreatedAt</th>
                    <td className="border px-4 py-2 w-4/5">
                      {formattedDate(contact.createdAt)}
                    </td>
                  </tr>
                  <tr className="text-left">
                    <th className="border px-4 py-2 w-1/5">UpdatedAt</th>
                    <td className="border px-4 py-2 w-4/5">
                      {formattedDate(contact.updatedAt)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Grid>
        </CardContent>
      </Card>
      {contact.status === false && (
        <Card className="mb-4">
          <CardHeader title="Admin Feedback" />
          <CardContent>
            <Grid size={{ xs: 12 }}>
              <form onSubmit={handleSubmit(onSubmit)}>
                <Grid container spacing={{ md: 4 }}>
                  <Grid size={{ md: 12 }}>
                    <Controller
                      name="remark"
                      control={control}
                      rules={{ required: false }}
                      render={({ field }) => (
                        <CustomTextField
                          {...field}
                          fullWidth
                          multiline
                          minRows={8}
                          className="mb-4"
                          label="Remark"
                          placeholder="Remark about this contact"
                          {...(errors.remark && {
                            error: true,
                            helperText: errors.remark.message,
                          })}
                        />
                      )}
                    />
                  </Grid>

                  <Grid size={{ xs: 12 }} className="flex gap-4">
                    <Button
                      variant="contained"
                      type="submit"
                      disabled={isSubmitting}
                      endIcon={
                        isSubmitting ? (
                          <i className="tabler-rotate-clockwise-2 motion-safe:animate-spin" />
                        ) : null
                      }
                    >
                      Marked as Solved
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </Grid>
          </CardContent>
        </Card>
      )}
    </>
  );
};

export default DetailInfo;
