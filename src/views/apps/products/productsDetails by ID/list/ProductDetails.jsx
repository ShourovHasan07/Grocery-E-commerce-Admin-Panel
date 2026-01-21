"use client";

import React from "react";
import {
  Card,
  CardHeader,
  CardContent,
  Typography,
  Divider,
  Chip,
  Box,
  Rating,
  Grid,
} from "@mui/material";

export default function ProductDetails({ product }) {
  // Use editProduct if exists
  const data = product?.editProduct || product;

  if (!data) return <Typography>No product found</Typography>;

  const renderField = (label, value) => {
    if (value === null || value === undefined || value === "") return null;
    return (
      <Typography variant="body2" sx={{ mb: 0.5 }}>
        <strong>{label}:</strong> {value}
      </Typography>
    );
  };

  return (
    <Card sx={{ p: 1, borderRadius: 3, boxShadow: 3 , spacing:10 }}>
      <CardHeader
        title={`Product Details: ${data.name}`}
        sx={{ backgroundColor: "#f5f5f5", borderRadius: 1 }}
      />
      <CardContent>
        <Grid container spacing={3}>
          {/* IMAGE */}
          <Grid item xs={12} md={4}>
            {data.image ? (
              <Box
                component="img"
                src={data.image}
                alt={data.name}
                sx={{
                  width: "100%",
                  borderRadius: 2,
                  border: "1px solid #e0e0e0",
                  maxHeight: 300,
                  objectFit: "cover",
                  transition: "transform 0.3s, box-shadow 0.3s",
                  "&:hover": {
                    transform: "scale(1.05)",
                    boxShadow: 6,
                  },
                }}
              />
            ) : (
              <Box
                sx={{
                  width: "100%",
                  height: 300,
                  borderRadius: 2,
                  border: "1px dashed #ccc",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  color: "#999",
                }}
              >
                No Image
              </Box>
            )}
          </Grid>

          {/* BASIC INFO */}
          <Grid item xs={12} md={8}>
            <Typography variant="h6" gutterBottom>
              Basic Info
            </Typography>
            {renderField("Name", data.name)}
            {renderField("Category", data.category)}
            {renderField("Vendor", data.vendor)}
            {data.badge && (
              <Chip label={data.badge} color="primary" size="small" sx={{ mt: 0.5 }} />
            )}
            {data.status && (
              <Chip
                label={data.status}
                color={data.status === "Active" ? "success" : "error"}
                size="small"
                sx={{ ml: 1 }}
              />
            )}

            <Divider sx={{ my: 1 }} />

            <Typography variant="h6" gutterBottom>
              Pricing
            </Typography>
            {renderField("Price", `$${data.price}`)}
            {renderField("Old Price", data.oldPrice ? `$${data.oldPrice}` : null)}
            {data.discount && (
              <Chip label={`${data.discount}% OFF`} color="secondary" size="small" />
            )}
            {data.rating && (
              <Box sx={{ display: "flex", alignItems: "center", mt: 0.5 }}>
                <Rating value={Number(data.rating)} readOnly size="small" />
                {data.reviewCount && (
                  <Typography variant="caption" sx={{ ml: 0.5 }}>
                    ({data.reviewCount} reviews)
                  </Typography>
                )}
              </Box>
            )}

            <Divider sx={{ my: 1 }} />

            <Typography variant="h6" gutterBottom>
              Inventory
            </Typography>
            {renderField("Stock", data.stock)}
            {renderField("Type", data.type)}
            {renderField("SKU", data.sku)}

            <Divider sx={{ my: 1 }} />

            <Typography variant="h6" gutterBottom>
              Manufacture Info
            </Typography>
            {renderField("Manufacture Date", data.manufactureDate)}
            {renderField("Lifetime Days", data.lifeTimeDays)}
          </Grid>

          {/* DESCRIPTION */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Description
            </Typography>
            {renderField("Short Description", data.shortDescription)}
            {renderField("Full Description", data.description)}
            {renderField("Ingredients", data.ingredients)}
            {renderField("Warnings", data.warnings)}
            {renderField("Suggested Use", data.suggestedUse)}
            {renderField("Packaging Info", data.packagingInfo)}
            {renderField("Delivery Info", data.deliveryInfo)}
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}
