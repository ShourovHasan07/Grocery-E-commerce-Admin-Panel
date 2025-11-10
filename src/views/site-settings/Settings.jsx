"use client";

// React Imports
import { useEffect, useRef, useState } from "react";

import { useRouter } from "next/navigation";
import Link from "next/link";

// MUI Imports
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid2";
import Button from "@mui/material/Button";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Chip from "@mui/material/Chip";
import Skeleton from "@mui/material/Skeleton";

// Third-party Imports
import { toast } from "react-toastify";
import { Controller, useForm } from "react-hook-form";

// Components Imports
import { z } from "zod";

import { zodResolver } from "@hookform/resolvers/zod";

import { useSession } from "next-auth/react";

import CustomTextField from "@core/components/mui/TextField";
import CustomAutocomplete from "@core/components/mui/Autocomplete";

import pageApiHelper from "@/utils/pageApiHelper";


const Settings = () => {

  const { data: session } = useSession();
  const token = session?.accessToken;

  // States
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [loading, setLoading] = useState(false);
  const [siteSettings, setSiteSettings] = useState({});

  useEffect(() => {
    if (!token) return;

    const getSettings = async () => {
      setLoading(true);

      try {
        const { data } = await pageApiHelper.get("site-settings", {}, token);

        // console.log("site settings data", data.data.settings);

        setSiteSettings(data.data.settings || {});
      } catch (error) {
        // console.error('Error fetching sessionFees:', error);
      } finally {
        setLoading(false);
      }
    };

    getSettings();
  }, [token]);

  // Hooks
  const router = useRouter();

  const {
    control,
    handleSubmit,
    formState: { errors },
    setError,
    reset,
  } = useForm({
    defaultValues: {},
  });

  // Update form values when settings are loaded
  useEffect(() => {
    if (siteSettings && Object.keys(siteSettings).length > 0) {
      const defaultValues = {};

      Object.values(siteSettings).forEach((setting) => {
        defaultValues[setting.name] = setting.value || '';
      });
      reset(defaultValues);
    }
  }, [siteSettings, reset]);

  // Sort settings by priority
  const sortedSettings = Object.values(siteSettings).sort((a, b) => a.priority - b.priority);

  // Render field based on type
  const renderField = (setting) => {
    const { name, type, value } = setting;

    switch (type) {
      case 'image':
        return (
          <Controller
            key={name}
            name={name}
            control={control}
            render={({ field: { onChange, value: fieldValue, ...field } }) => (
              <div className="mb-4">
                <CustomTextField
                  {...field}
                  fullWidth
                  type="file"
                  label={name.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                  onChange={(e) => onChange(e.target.files?.[0])}
                  InputLabelProps={{ shrink: true }}
                />
                {value && (
                  <div className="mt-2 text-sm text-gray-600">
                    Current file: {value}
                  </div>
                )}
              </div>
            )}
          />
        );

      case 'textarea':
        return (
          <Controller
            key={name}
            name={name}
            control={control}
            render={({ field }) => (
              <CustomTextField
                {...field}
                value={field.value ?? value ?? ""}
                fullWidth
                multiline
                minRows={8}
                className="mb-4"
                label={name.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                placeholder={name.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
              />
            )}
          />
        );

      case 'text':
      default:
        return (
          <Controller
            key={name}
            name={name}
            control={control}
            render={({ field }) => (
              <CustomTextField
                {...field}
                value={field.value ?? value ?? ""}
                fullWidth
                className="mb-4"
                label={name.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                placeholder={name.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
              />
            )}
          />
        );
    }
  };

  // form submission

  const onSubmit = async (formData) => {
    setIsSubmitting(true);

    try {
      const form = new FormData();

      // Append all form data
      Object.keys(formData).forEach((key) => {
        const setting = Object.values(siteSettings).find(s => s.name === key);

        if (setting?.type === 'image' && formData[key] instanceof File) {
          form.append(key, formData[key]);
        } else if (formData[key]) {
          form.append(key, formData[key].toString().trim());
        }
      });

      let res = await pageApiHelper.post(
        `site-settings`,
        form,
        token,
      );

      if (!res?.success && res?.status === 400) {
        let errors = res?.data?.data?.errors || [];

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

      if (res?.success && res?.data?.data?.success) {
        toast.success("Settings updated successfully");
      }
    } catch (error) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader title="Site Settings Info" />
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={{ md: 6 }}>
            <Grid size={{ md: 12 }}>
              {loading ? (
                <>
                  <Skeleton variant="rounded" height={56} className="mb-4" />
                  <Skeleton variant="rounded" height={56} className="mb-4" />
                  <Skeleton variant="rounded" height={56} className="mb-4" />
                  <Skeleton variant="rounded" height={56} className="mb-4" />
                  <Skeleton variant="rounded" height={56} className="mb-4" />
                  <Skeleton variant="rounded" height={180} className="mb-4" />
                </>
              ) : (
                sortedSettings.map((setting) => renderField(setting))
              )}
            </Grid>

            <Grid size={{ xs: 12 }} className="flex gap-4">
              <Button
                variant="contained"
                type="submit"
                disabled={isSubmitting || loading}
                endIcon={
                  isSubmitting ? (
                    <i className="tabler-rotate-clockwise-2 motion-safe:animate-spin" />
                  ) : null
                }
              >
                Submit
              </Button>
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </Card>
  );
};

export default Settings;
