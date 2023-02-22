import { FC } from 'react';
import {
  Button,
  Dialog,
  DialogContent,
  DialogActions,
  DialogTitle,
  DialogContentText
} from "@mui/material";
import { ConfirmationDialogPropsInterface } from "../types";
import { useTranslation } from 'react-i18next';
import '../i18n';

const ConfirmationDialog: FC<ConfirmationDialogPropsInterface> = ({ open, closeDialog, changingAccountImage, setChangingAccountImage }) => {
  const { t } = useTranslation();
  return (
    <Dialog
      open={open}
      keepMounted
      onClose={closeDialog}
      aria-describedby="alert-dialog-slide-description"
      className="confirmation-dialog"
    >
      <DialogTitle>
        {t("confirmationDialog.pleaseConfirmTheAction")}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-slide-description">
          {t("confirmationDialog.doYouWantToSetThisImageAsYourProfilePicture")}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={closeDialog}>
          {t("confirmationDialog.no")}
        </Button>
        <Button onClick={() => {
          setChangingAccountImage(!changingAccountImage);
          closeDialog();
        }}>
          {t("confirmationDialog.yes")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmationDialog;