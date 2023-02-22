import { FC } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from "@mui/material";
import { ChatDeletionDialogPropsInterface } from '../types';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import '../i18n';

const ChatDeletionDialog: FC<ChatDeletionDialogPropsInterface> = ({ dialog, closeDialog, getChatsData }) => {
  const { t } = useTranslation();
  return (
    <Dialog
      open={dialog.open}
      keepMounted
      onClose={closeDialog}
      aria-describedby="alert-dialog-slide-description"
      className="chat-deletion-dialog"
    >
      <DialogTitle>
        {t("chatDeletionDialog.areYouSureYouWantToDeleteThisDialog")}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-slide-description">
          {t("chatDeletionDialog.pleaseKeepInMindThatTheDialogWillBeDeletedForYourInterlocutorAsWell")}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={closeDialog}>
          {t("chatDeletionDialog.cancel")}
        </Button>
        <Button onClick={() => {
          axios
            .delete(`/api/chat/${dialog.chatId}`)
            .then(() => {
              getChatsData();
              closeDialog();
            })
            .catch(error => {
              closeDialog();
              console.error("The error occured: ", error.message);
            })
        }}>
          {t("chatDeletionDialog.ok")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ChatDeletionDialog;