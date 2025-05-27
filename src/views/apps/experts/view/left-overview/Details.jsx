// MUI Imports
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";
import Link from "next/link";

import CustomAvatar from "@core/components/mui/Avatar";

import { activeStatusLabel, activeStatusColor } from "@/utils/helpers";

const Details = ({ expertData }) => {

  return (
    <>
      <Card>
        <CardContent className="flex flex-col pbs-12 gap-6">
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-center flex-col gap-2">
              <div className="flex flex-col items-center gap-3">
                <CustomAvatar
                  alt="user-profile"
                  src={expertData.image}
                  variant="rounded"
                  size={120}
                />
                <Typography variant="h5">{expertData.name}</Typography>
              </div>
              <Typography>{expertData.title}</Typography>
            </div>
            <div className="flex items-center justify-around flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <CustomAvatar variant="rounded" color="primary" skin="light">
                  <i className="tabler-checkbox" />
                </CustomAvatar>
                <div>
                  <Typography variant="h5">{expertData.rating}</Typography>
                  <Typography>Out of 5</Typography>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <CustomAvatar variant="rounded" color="primary" skin="light">
                  <i className="tabler-briefcase" />
                </CustomAvatar>
                <div>
                  <Typography variant="h5">{expertData.reviewCount}</Typography>
                  <Typography>Total Review</Typography>
                </div>
              </div>
            </div>
          </div>
          <div>
            <Typography variant="h5">Details</Typography>
            <Divider className="mlb-4" />
            <div className="flex flex-col gap-2">
              <div className="flex items-center flex-wrap gap-x-1.5">
                <Typography className="font-medium" color="text.primary">
                  Email:
                </Typography>
                <Typography>{expertData.email}</Typography>
              </div>
              <div className="flex items-center flex-wrap gap-x-1.5">
                <Typography className="font-medium" color="text.primary">
                  Phone:
                </Typography>
                <Typography color="text.primary">{expertData.phone}</Typography>
              </div>
              <div className="flex items-center flex-wrap gap-x-1.5">
                <Typography className="font-medium" color="text.primary">
                  Address:
                </Typography>
                <Typography color="text.primary">{expertData.address}</Typography>
              </div>
              <div className="flex items-center flex-wrap gap-x-1.5">
                <Typography className="font-medium" color="text.primary">
                  Hourly Rate:
                </Typography>
                <Typography color="text.primary">{expertData.hourlyRate}</Typography>
              </div>
              <div className="flex items-center flex-wrap gap-x-1.5">
                <Typography className="font-medium" color="text.primary">
                  Status
                </Typography>
                <Chip
                  variant="tonal"
                  label={activeStatusLabel(expertData.status)}
                  size="small"
                  color={activeStatusColor(expertData.status)}
                  className="capitalize"
                />
              </div>
              <Divider className="my-2" />
              <div className="flex items-center justify-end">
                <Button
                  variant="tonal"
                  color="error"
                  component={Link}
                  href={"/experts"}
                >
                  Back to List
                </Button>
              </div>

            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default Details;
