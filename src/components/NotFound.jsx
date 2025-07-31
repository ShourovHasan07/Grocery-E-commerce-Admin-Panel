"use client";

import { useRouter } from "next/navigation";

import { Card, Typography, Button } from "@mui/material";

const NotFound = ({
  title = "Not Found",
  message = "The requested information is missing or unavailable.",
  buttonLabel = "Back",
  redirectPath = "/"
}) => {
  const router = useRouter();

  return (
    <Card className="p-6 w-full shadow-md border border-slate-200 bg-slate-50">
      <div className="space-y-4 text-center">
        <div className="flex justify-center">
          <img
            alt="error-404-illustration"
            src="/images/illustrations/characters/1.png"
            className="object-cover bs-[400px] md:bs-[450px] lg:bs-[500px] mbs-10 md:mbs-12 lg:mbs-18"
          />
        </div>
        <Typography variant="h6" className="text-red-500  text-xl font-semibold">
          {title}
        </Typography>
        <Typography className="text-sm text-gray-700 leading-relaxed">
          {message}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => router.push(redirectPath)}
          className="capitalize"
        >
          {buttonLabel}
        </Button>
      </div>
    </Card>
  );
};

export default NotFound;
