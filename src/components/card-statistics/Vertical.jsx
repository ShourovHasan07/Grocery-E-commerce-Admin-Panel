// MUI Imports
import Link from "next/link";

import Card from "@mui/material/Card";
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";

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
    qty,
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
          <Typography variant="h4" color="text.primary">{qty}</Typography>
        </div>

        <div className="flex flex-col gap-y-1">
          <Typography variant="h5">{title}</Typography>
          <Typography color="text.disabled">{subtitle}</Typography>
          <Typography color="text.primary">{stats}</Typography>
        </div>

        <div className="flex justify-between w-full items-center gap-2">
          <Chip
            label={chipText}
            color={chipColor}
            variant={chipVariant}
            size="small"
          />

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
