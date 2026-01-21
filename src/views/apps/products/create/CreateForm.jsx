"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

import {
  Card,
  CardHeader,
  CardContent,
  Button,

} from "@mui/material";
import Grid from "@mui/material/Grid2";

import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";

import CustomTextField from "@core/components/mui/TextField";

/* ---------------- ZOD SCHEMA ---------------- */
const schema = z.object({
  name: z.string().min(3),
  category: z.string(),
  vendor: z.string(),

  price: z.string(),
  oldPrice: z.string().optional(),
  discount: z.string().optional(),

  badge: z.string().optional(),
  rating: z.string().optional(),
  reviewCount: z.string().optional(),

  shortDescription: z.string(),
  description: z.string(),

  stock: z.string(),
  type: z.string(),

  manufactureDate: z.string(),
  lifeTimeDays: z.string(),

  sku: z.string(),
  ingredients: z.string().optional(),
  warnings: z.string().optional(),
  suggestedUse: z.string().optional(),

  packagingInfo: z.string().optional(),
  deliveryInfo: z.string().optional(),

  image: z.any().refine((file) => file?.length > 0, "Image required"),
});

/* ---------------- COMPONENT ---------------- */
export default function CreateProductForm() {
  const router = useRouter();
  const { data: session } = useSession();
  const token = session?.accessToken;

  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);
  const fileRef = useRef(null);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      category: "",
      vendor: "",
      price: "",
      oldPrice: "",
      discount: "",
      badge: "",
      rating: "",
      reviewCount: "",
      shortDescription: "",
      description: "",
      stock: "",
      type: "",
      manufactureDate: "",
      lifeTimeDays: "",
      sku: "",
      ingredients: "",
      warnings: "",
      suggestedUse: "",
      packagingInfo: "",
      deliveryInfo: "",
      image: "",
    },
  });

  /* ---------------- IMAGE PREVIEW ---------------- */
  const handleImage = (files, onChange) => {
    if (files?.[0]) {
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target.result);
      reader.readAsDataURL(files[0]);
    }
    onChange(files);
  };

  /* ---------------- SUBMIT ---------------- */
  const onSubmit = async (data) => {
    setLoading(true);

    try {
      const formData = new FormData();

      Object.keys(data).forEach((key) => {
        if (key === "image") {
          formData.append("image", data.image[0]);
        } else {
          formData.append(key, data[key]);
        }
      });

      const res = await fetch(
        "http://localhost:4000/admin/products/create",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || "Failed");
      }

      toast.success("Product created successfully");
      reset();
      setPreview(null);
      router.push("/products");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- UI ---------------- */
  return (


<Card>
  <CardHeader title="Create Product" />
  <CardContent>
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={4}>

        {/* ===== BASIC INFO ===== */}
        <Grid size={{ xs: 12 }}>
          <h3 className="font-semibold text-lg">Basic Information</h3>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <CustomTextField {...field} label="Product Name" fullWidth />
            )}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Controller
            name="category"
            control={control}
            render={({ field }) => (
              <CustomTextField {...field} label="Category" fullWidth />
            )}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Controller
            name="vendor"
            control={control}
            render={({ field }) => (
              <CustomTextField {...field} label="Vendor" fullWidth />
            )}
          />
        </Grid>

        {/* ===== PRICING ===== */}
        <Grid size={{ xs: 12 }}>
          <h3 className="font-semibold text-lg">Pricing</h3>
        </Grid>

        <Grid size={{ xs: 12, md: 3 }}>
          <Controller
            name="price"
            control={control}
            render={({ field }) => (
              <CustomTextField {...field} label="Price" type="number" fullWidth />
            )}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 3 }}>
          <Controller
            name="oldPrice"
            control={control}
            render={({ field }) => (
              <CustomTextField {...field} label="Old Price" type="number" fullWidth />
            )}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 3 }}>
          <Controller
            name="discount"
            control={control}
            render={({ field }) => (
              <CustomTextField {...field} label="Discount %" type="number" fullWidth />
            )}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 3 }}>
          <Controller
            name="badge"
            control={control}
            render={({ field }) => (
              <CustomTextField {...field} label="Badge (New / Hot)" fullWidth />
            )}
          />
        </Grid>

        {/* ===== DESCRIPTION ===== */}
        <Grid size={{ xs: 12 }}>
          <h3 className="font-semibold text-lg">Description</h3>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Controller
            name="shortDescription"
            control={control}
            render={({ field }) => (
              <CustomTextField {...field} label="Short Description" fullWidth />
            )}
          />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <CustomTextField
                {...field}
                label="Full Description"
                multiline
                minRows={4}
                fullWidth
              />
            )}
          />
        </Grid>

        {/* ===== INVENTORY ===== */}
        <Grid size={{ xs: 12 }}>
          <h3 className="font-semibold text-lg">Inventory</h3>
        </Grid>

        <Grid size={{ xs: 12, md: 3 }}>
          <Controller
            name="stock"
            control={control}
            render={({ field }) => (
              <CustomTextField {...field} label="Stock" type="number" fullWidth />
            )}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 3 }}>
          <Controller
            name="type"
            control={control}
            render={({ field }) => (
              <CustomTextField {...field} label="Product Type" fullWidth />
            )}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 3 }}>
          <Controller
            name="sku"
            control={control}
            render={({ field }) => (
              <CustomTextField {...field} label="SKU" fullWidth />
            )}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 3 }}>
          <Controller
            name="rating"
            control={control}
            render={({ field }) => (
              <CustomTextField {...field} label="Rating (0-5)" type="number" fullWidth />
            )}
          />
        </Grid>

        {/* ===== DATES ===== */}
        <Grid size={{ xs: 12 }}>
          <h3 className="font-semibold text-lg">Manufacture Info</h3>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Controller
            name="manufactureDate"
            control={control}
            render={({ field }) => (
              <CustomTextField
                {...field}
                label="Manufacture Date"
                type="date"
                InputLabelProps={{ shrink: true }}
                fullWidth
              />
            )}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Controller
            name="lifeTimeDays"
            control={control}
            render={({ field }) => (
              <CustomTextField {...field} label="Lifetime (Days)" type="number" fullWidth />
            )}
          />
        </Grid>

        {/* ===== IMAGE ===== */}
        <Grid size={{ xs: 12 }}>
          <h3 className="font-semibold text-lg">Product Image</h3>
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Controller
            name="image"
            control={control}
            render={({ field }) => (
              <CustomTextField
                type="file"
                fullWidth
                inputRef={fileRef}
                inputProps={{
                  accept: "image/*",
                  onChange: (e) =>
                    handleImage(e.target.files, field.onChange),
                }}
              />
            )}
          />
          {preview && (
            <img src={preview} className="mt-3 h-20 rounded-md border" />
          )}
        </Grid>

        {/* ===== ACTIONS ===== */}
        <Grid size={{ xs: 12 }} className="flex gap-3 mt-4">
          <Button type="submit" variant="contained" disabled={loading}>
            {loading ? "Saving..." : "Create Product"}
          </Button>
          <Button variant="outlined" color="secondary" onClick={() => reset()}>
            Reset
          </Button>
        </Grid>

      </Grid>
    </form>
  </CardContent>
</Card>

  );
}
