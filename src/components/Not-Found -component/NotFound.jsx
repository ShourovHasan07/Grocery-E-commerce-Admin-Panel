"use client";

import { Card, Typography, Button } from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { useRouter } from "next/navigation";

const NotFound = ({
  title = " Not Found",
  message = "The requested information is missing or unavailable.",
  buttonLabel = "Back to List",
  redirectPath = "/"
}) => {
  const router = useRouter();

  return (
    <div className="flex items-center justify-center min-h-[300px] px-4">
      <Card className="p-6 max-w-md w-full shadow-md border border-slate-200 bg-slate-50">
        <div className="space-y-4 text-center">
          <div className="flex justify-center text-red-500">
            <InfoOutlinedIcon fontSize="large" />
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
    </div>
  );
};

export default NotFound;
