import { useState, FC } from "react";
import {
  Breadcrumbs,
  Link,
  Paper,
  Typography,
} from "@mui/material";
import { Outlet, useNavigate } from "react-router-dom";
import { ProfileContextInterface } from "../types";
import ConfirmationDialog from "./ConfirmationDialog";
import { useTranslation } from 'react-i18next';
import '../i18n';

const Profile: FC = () => {
  const { t } = useTranslation();
  // const { user, isAccountImageChanged, setIsAccountImageChanged } = useContext(UserContext);
  const defaultOutletTitle = t("profile.myProfile");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [changingAccountImage, setChangingAccountImage] = useState(false);
  const closeDialog = () => setIsDialogOpen(false);
  const outletTitle = localStorage.getItem("outletTitle");
  const navigate = useNavigate();

  const outletContext: ProfileContextInterface = {
    changingAccountImage,
    closeDialog,
    outletTitle,
    setIsDialogOpen,
  };

  // useEffect(() => {
  //   localStorage.getItem("ad-id_selected") ? setOutletTitle("My Chats") : setOutletTitle(defaultOutletTitle);
  // }, []);

  // useEffect(() => {

  //   outletTitle &&
  //     navigate(
  //       outletTitle === defaultOutletTitle ?
  //         "/profile/general-info" :
  //         outletTitle === "My Ads" ?
  //           "/profile/ads" :
  //           outletTitle === "My Chats" ?
  //             "/profile/chats" :
  //             "/"
  //     );
  // }, [outletTitle]);

  return (
    <Paper className="profile-container" sx={{ backgroundColor: "secondary.light" }}>
      {outletTitle !== defaultOutletTitle &&
        <Breadcrumbs aria-label="breadcrumb">
          <Link
            underline="hover"
            color="inherit"
            onClick={() => {
              localStorage.setItem("outletTitle", t("profile.myProfile"));
              navigate("/profile/general-info");
            }}
          >
            {t("profile.myProfile")}
          </Link>
          <Typography color="text.primary">
            {outletTitle}
          </Typography>
        </Breadcrumbs>
      }
      <Typography variant="h4">
        {outletTitle}
      </Typography>
      <Outlet context={outletContext} />
      <ConfirmationDialog
        open={isDialogOpen}
        closeDialog={closeDialog}
        changingAccountImage={changingAccountImage}
        setChangingAccountImage={setChangingAccountImage}
      />
    </Paper>
  );
};

export default Profile;