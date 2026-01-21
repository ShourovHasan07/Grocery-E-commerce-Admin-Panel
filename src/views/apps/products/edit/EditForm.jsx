"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

import { Card, CardHeader, CardContent, Button } from "@mui/material";
import Grid from "@mui/material/Grid2";

import { useForm, Controller } from "react-hook-form";
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

  image: z.any().optional(), // edit time optional
});

/* ---------------- COMPONENT ---------------- */
export default function EditProductForm({ editProduct }) {
  const router = useRouter();
  const { data: session } = useSession();
  const token = session?.accessToken;

  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);
  const fileRef = useRef(null);

  const { control, handleSubmit, reset } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {},
  });

  /* ---------------- PREFILL ALL FIELDS ---------------- */
  useEffect(() => {
    if (editProduct) {
      reset({
        name: editProduct.name || "",
        category: editProduct.category || "",
        vendor: editProduct.vendor || "",

        price: String(editProduct.price || ""),
        oldPrice: String(editProduct.oldPrice || ""),
        discount: String(editProduct.discount || ""),

        badge: editProduct.badge || "",
        rating: String(editProduct.rating || ""),
        reviewCount: String(editProduct.reviewCount || ""),

        shortDescription: editProduct.shortDescription || "",
        description: editProduct.description || "",

        stock: String(editProduct.stock || ""),
        type: editProduct.type || "",

        manufactureDate: editProduct.manufactureDate?.slice(0, 10) || "",
        lifeTimeDays: String(editProduct.lifeTimeDays || ""),

        sku: editProduct.sku || "",
        ingredients: editProduct.ingredients || "",
        warnings: editProduct.warnings || "",
        suggestedUse: editProduct.suggestedUse || "",

        packagingInfo: editProduct.packagingInfo || "",
        deliveryInfo: editProduct.deliveryInfo || "",
      });

      if (editProduct.image) {
        setPreview(editProduct.image);
      }
    }
  }, [editProduct, reset]);

  /* ---------------- IMAGE PREVIEW ---------------- */
  const handleImage = (files, onChange) => {
    if (files?.[0]) {
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target.result);
      reader.readAsDataURL(files[0]);
      onChange(files);
    }
  };

  /* ---------------- SUBMIT (PUT UPDATE) ---------------- */
  const onSubmit = async (data) => {
    setLoading(true);

    try {
      const formData = new FormData();

      Object.entries(data).forEach(([key, value]) => {
        if (key === "image") {
          if (value?.[0]) formData.append("image", value[0]);
        } else {
          formData.append(key, value);
        }
      });

      const res = await fetch(
        `http://localhost:4000/admin/products/${editProduct.id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const result = await res.json();

      if (!res.ok) throw new Error(result.message || "Update failed");

      toast.success("Product updated successfully");
      router.push("/products");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- UI ---------------- */
  const renderField = (name, label, type = "text", multiline = false) => (
    <Grid size={{ xs: 12, md: 4 }}>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <CustomTextField
            {...field}
            label={label}
            type={type}
            multiline={multiline}
            minRows={multiline ? 3 : undefined}
            fullWidth
          />
        )}
      />
    </Grid>
  );

  return (
    <Card>
      <CardHeader title="Update Product" />
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={4}>

            {renderField("name", "Name")}
            {renderField("category", "Category")}
            {renderField("vendor", "Vendor")}

            {renderField("price", "Price", "number")}
            {renderField("oldPrice", "Old Price", "number")}
            {renderField("discount", "Discount (%)", "number")}

            {renderField("badge", "Badge")}
            {renderField("rating", "Rating", "number")}
            {renderField("reviewCount", "Review Count", "number")}

            {renderField("shortDescription", "Short Description", "text", true)}
            {renderField("description", "Description", "text", true)}

            {renderField("stock", "Stock", "number")}
            {renderField("type", "Type")}
            {renderField("sku", "SKU")}

            {renderField("manufactureDate", "Manufacture Date", "date")}
            {renderField("lifeTimeDays", "Lifetime Days", "number")}

            {renderField("ingredients", "Ingredients")}
            {renderField("warnings", "Warnings")}
            {renderField("suggestedUse", "Suggested Use")}

            {renderField("packagingInfo", "Packaging Info")}
            {renderField("deliveryInfo", "Delivery Info")}

            {/* IMAGE */}
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
                <img src={preview} className="mt-3 h-24 rounded border" />
              )}
            </Grid>

            {/* ACTIONS */}
            <Grid size={{ xs: 12 }} className="flex gap-3">
              <Button type="submit" variant="contained" disabled={loading}>
                {loading ? "Updating..." : "Update Product"}
              </Button>
              <Button variant="outlined" onClick={() => reset()}>
                Reset
              </Button>
            </Grid>

          </Grid>
        </form>
      </CardContent>
    </Card>
  );
}
