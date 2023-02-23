import { useState, useEffect, useContext, FC } from 'react';
import LogInForm from "./LogInForm";
import SignUpForm from "./SignUpForm";
import { Dialog, DialogTitle, DialogContent, Backdrop, CircularProgress } from "@mui/material";
import { UserContext } from './UserContext';
import { useTranslation } from 'react-i18next';
import '../i18n';

const AccountDialog: FC = () => {
  const { t } = useTranslation();
  const { isLogInDialogOpen, setIsLogInDialogOpen } = useContext(UserContext);
  const [loading, setLoading] = useState(false);
  const [isSignUpDialogOpen, setIsSignUpDialogOpen] = useState(false);

  const [message, setMessage] = useState("");

  useEffect(() => {
    isSignUpDialogOpen && setIsLogInDialogOpen(false);
  }, [isSignUpDialogOpen]);

  useEffect(() => {
    isLogInDialogOpen && setIsSignUpDialogOpen(false);
  }, [isLogInDialogOpen]);

  const closeDialog = (): void => {
    isLogInDialogOpen && setIsLogInDialogOpen(false);
    isSignUpDialogOpen && setIsSignUpDialogOpen(false);
    setMessage("");
  };

  return (
    <Dialog
      open={isLogInDialogOpen || isSignUpDialogOpen}
      keepMounted
      onClose={closeDialog}
      className="account-dialog"
    >
      {!message && (
        <DialogTitle>
          {isLogInDialogOpen ? t("accountDialog.logIn") : t("accountDialog.createAnAccount")}
        </DialogTitle>
      )}
      <DialogContent className={`dialog-content ${message ? "no-padding" : ""}`}>
        {isLogInDialogOpen ?
          <LogInForm
            isOpen={isLogInDialogOpen}
            setIsSignUpDialogOpen={setIsSignUpDialogOpen}
            setLoading={setLoading}
          /> :
          <SignUpForm
            setLoading={setLoading}
            setIsOpen={setIsSignUpDialogOpen}
            message={message}
            setMessage={setMessage}
          />
        }
      </DialogContent>
      <Backdrop
        open={loading}
        className="backdrop"
      >
        <CircularProgress />
      </Backdrop>
    </Dialog>
  );
};

export default AccountDialog;