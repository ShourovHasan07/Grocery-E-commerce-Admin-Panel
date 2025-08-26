// React Imports
import { useState } from "react";

// MUI Imports
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import useMediaQuery from "@mui/material/useMediaQuery";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";

const ConfirmDialog = (props) => {
  const { dialogData, handleCloseDialog, handleDelete } = props;

  // Hooks
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Dialog
      fullScreen={fullScreen}
      open={dialogData.open}
      onClose={handleCloseDialog}
      aria-labelledby="confirm-dialog"
      closeAfterTransition={false}
    >
      <DialogContent className="flex items-center flex-col text-center sm:pbs-16 sm:pbe-6 sm:pli-16">
        <i className="tabler-alert-circle text-[88px] mbe-6 text-warning" />

        <Typography variant="h4">
          Are you sure you want to delete this Item?
        </Typography>

        <Typography color="text.primary">
          You won&#39;t be able to revert anymore!
        </Typography>
      </DialogContent>

      <DialogActions className="dialog-actions-dense justify-center pbs-0 sm:pbe-16 sm:pli-16">
        <Button variant="contained" color="error" onClick={handleCloseDialog}>
          No
        </Button>

        <Button variant="contained" color="success" onClick={handleDelete}>
          Yes Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;
