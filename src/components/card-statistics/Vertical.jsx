// MUI Imports
import Link from "next/link";

import Card from "@mui/material/Card";
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Skeleton from "@mui/material/Skeleton";

// Third-party Imports
import classnames from "classnames";

// Component Import
import CustomAvatar from "@core/components/mui/Avatar";

const CardStatsVertical = (props) => {
  // Props
  const {
    stats,
    title,
    subtitle,
    avatarIcon,
    avatarColor,
    avatarSize,
    avatarSkin,
    chipText,
    chipColor,
    chipVariant,
    loading,
    data,
    url,
  } = props;

  return (
    <Card className="bs-full">
      <CardContent className="flex flex-col gap-y-3 items-start">
        <div className="flex gap-2 items-center">
          <CustomAvatar
            variant="rounded"
            skin={avatarSkin}
            size={avatarSize}
            color={avatarColor}
          >
            <i className={classnames(avatarIcon, "text-[28px]")} />
          </CustomAvatar>
          {loading ? (
            <Skeleton variant="rounded" width={30} height={30} />
          ) : (
            <Typography variant="h4" color="text.primary">{data?.count || 0}</Typography>
          )}


        </div>

        <div className="flex flex-col gap-y-1">
          <Typography variant="h5">{title}</Typography>
          <Typography color="text.disabled">{subtitle}</Typography>
          <Typography color="text.primary">{stats}</Typography>
        </div>

        <div className="flex justify-between w-full items-center gap-2">
          {chipText && (
            <>
              {loading ? (
                <Skeleton variant="rounded" width={40} height={24} />
              ) : (
                <Chip
                  label={data?.percentage || 0}
                  color={chipColor}
                  variant={chipVariant}
                  size="small"
                />
              )}
            </>
          )}

          {url && <Button
            size="small"
            variant="tonal"
            color={chipColor}
            component={Link}
            href={url}
          >
            Details
          </Button>
          }
        </div>
      </CardContent>
    </Card>
  );
};

export default CardStatsVertical;
