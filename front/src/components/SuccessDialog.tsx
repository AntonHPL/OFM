import { FC } from "react";
import {
  Button,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Dialog,
} from "@mui/material";
import { DialogInterface } from "../types";
import { useTranslation } from 'react-i18next';
import '../i18n';

const SuccessDialog: FC<DialogInterface> = ({ open, closeDialog }) => {
  const { t } = useTranslation();
  return (
    <Dialog
      open={open}
      keepMounted
      onClose={closeDialog}
      aria-describedby="alert-dialog-slide-description"
      className="success-dialog"
    >
      <DialogTitle>
        {t("successDialog.congratulations")}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-slide-description">
          {t("successDialog.yourAdWasSuccessfullyCreated")}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={closeDialog}>
          {t("successDialog.ok")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SuccessDialog;