import { useState, useEffect, useContext, FC, MouseEvent, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { AppBar, Menu, MenuItem, Toolbar, Box, Button, IconButton, Tooltip, ButtonGroup } from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import AccountCircle from "@mui/icons-material/AccountCircle";
import { UserContext } from "./UserContext";
import AccountDialog from "./AccountDialog";
import axios from "axios";
import "/node_modules/flag-icons/css/flag-icons.min.css";
import { useTranslation } from 'react-i18next';
import '../i18n';
// import { t, i18n } from "./translation";
import { AlternateEmail, Lens, Telegram, WhatsApp } from "@mui/icons-material";
import { orange, indigo } from "@mui/material/colors";

const Header: FC<any> = ({ logo, color, setColor }) => {
  const { t, i18n }: { t: (value: string) => string, i18n: { changeLanguage: (lang: string) => void } } = useTranslation();
  const { user, setUser, setIsLogInDialogOpen } = useContext(UserContext);
  const [accountMenuAnchorEl, setAccountMenuAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [languagesMenuAnchorEl, setLanguagesMenuAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [language, setLanguage] = useState("gb");
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null);
  // const [menu, setMenu] = useState(null);
  useMemo((): void => i18n.changeLanguage(language), [language]);
  const [accountImage, setAccountImage] = useState("");

  const isAccountMenuOpen = !!accountMenuAnchorEl;
  // const isMobileMenuOpen = !!mobileMoreAnchorEl;

  const isLanguagesMenuOpen = !!languagesMenuAnchorEl;

  const navigate = useNavigate();

  const openAccountMenu = (e: MouseEvent<HTMLButtonElement>): void => setAccountMenuAnchorEl(e.currentTarget);
  const openLanguagesMenu = (e: MouseEvent<HTMLButtonElement>): void => setLanguagesMenuAnchorEl(e.currentTarget);
  const handleMobileMenuClose = (): void => {
    setMobileMoreAnchorEl(null);
  };

  const closeAccountMenu = (): void => {
    setAccountMenuAnchorEl(null);
    handleMobileMenuClose();
  };

  const closeLanguagesMenu = (): void => {
    setLanguagesMenuAnchorEl(null);
  };

  const logout = (): void => {
    axios
      .get("/api/log-out")
      .then(() => {
        closeAccountMenu();
        setUser(null);
        setIsLogInDialogOpen(true);
      })
      .catch(error => {
        console.error("The error occured: ", error.message);
        closeAccountMenu();
      });
  };

  useEffect(() => {
    user && user.image && setAccountImage(user.image.data);
  }, [user])
  // const handleMobileMenuOpen = (event) => {
  //   setMobileMoreAnchorEl(event.currentTarget);
  // };

  // useEffect(() => {
  //   axios.get("/api/menu")
  //     .then(({ data }) => setMenu(data));
  // }, []);

  const open = (path: string, outletTitle: string): void => {
    closeAccountMenu();
    navigate(`/profile/${path}`);
    localStorage.setItem("outletTitle", outletTitle);
  };

  const languagesMenuId = "languages-menu-id";
  const renderLanguagesMenu = (
    <Menu
      anchorEl={languagesMenuAnchorEl}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      id={languagesMenuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isLanguagesMenuOpen}
      onClose={closeLanguagesMenu}
    >
      {["gb", "ru", "ua", "de"].filter(el => el !== language).map(el => (
        <MenuItem onClick={() => {
          setLanguage(el);
          closeLanguagesMenu();
        }
        }>
          {el === "gb" ? "EN" : el.toUpperCase()}
        </MenuItem>
      ))}
    </Menu>
  )
  const accountMenuId = "primary-search-account-menu";
  const renderAccountMenu = (
    <Menu
      anchorEl={accountMenuAnchorEl}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      id={accountMenuId}
      keepMounted
      // transformOrigin = {{
      //   vertical: "top",
      //   horizontal: "right",
      // }}
      open={isAccountMenuOpen}
      onClose={closeAccountMenu}
    >
      <MenuItem
        onClick={() => {
          if (user) {
            localStorage.setItem("outletTitle", "My Profile");
            navigate("/profile/general-info");
          } else {
            setIsLogInDialogOpen(true);
          }
          closeAccountMenu();
        }}
      >
        {t("header.myProfile")}
      </MenuItem>
      <MenuItem onClick={() => open("ads", "My Ads")}>
        {t("header.myAds")}
      </MenuItem>
      <MenuItem onClick={() => open("chats", "My Chats")}>
        {t("header.myChats")}
      </MenuItem>
      <MenuItem onClick={logout}>
        {t("header.logOut")}
      </MenuItem>
    </Menu>
  );

  // const mobileMenuId = "primary-search-account-menu-mobile";
  // const renderMobileMenu = (
  //   <Menu
  //     anchorEl = {mobileMoreAnchorEl}
  //     anchorOrigin = {{
  //       vertical: "top",
  //       horizontal: "right",
  //     }}
  //     id={mobileMenuId}
  //     keepMounted
  //     transformOrigin={{
  //       vertical: "top",
  //       horizontal: "right",
  //     }}
  //     open={isMobileMenuOpen}
  //     onClose={handleMobileMenuClose}
  //   >
  //     <MenuItem>
  //       <IconButton size="large" aria-label="show 4 new mails" color="inherit">
  //         <Badge badgeContent={4} color="error">
  //           <MailIcon />
  //         </Badge>
  //       </IconButton>
  //       <p>Messages</p>
  //     </MenuItem>
  //     <MenuItem>
  //       <IconButton
  //         size="large"
  //         aria-label="show 17 new notifications"
  //         color="inherit"
  //       >
  //         <Badge badgeContent={17} color="error">
  //           <NotificationsIcon />
  //         </Badge>
  //       </IconButton>
  //       <p>Notifications</p>
  //     </MenuItem>
  //     <MenuItem onClick={openMenu}>
  //       <IconButton
  //         size="large"
  //         aria-label="account of current user"
  //         aria-controls="primary-search-account-menu"
  //         aria-haspopup="true"
  //         color="inherit"
  //       >
  //         <AccountCircle />
  //       </IconButton>
  //       <p>Profile</p>
  //     </MenuItem>
  //   </Menu>
  // );

  const openWindow = (url: string): Window | null => window.open(url, "_blank");

  return (
    <div className="header-container">
      <AppBar position="static">
        <Toolbar>
          <div
            className="logo"
            onClick={() => window.location.href = "/"}
          >
            <img
              src={logo}
              alt="logo"
            />
          </div>
          <Tooltip title="Contact the Developer">
            <ButtonGroup>
              <IconButton onClick={() => openWindow("mailto:antosha.dashko@gmail.com")}>
                <AlternateEmail />
              </IconButton>
              <IconButton onClick={() => openWindow("https://t.me/Ant_tg")}>
                <Telegram />
              </IconButton>
            </ButtonGroup>
          </Tooltip>
          <Box sx={{ flexGrow: 1 }} />
          {[orange, indigo].filter(el => el !== color).map(el => (
            <IconButton onClick={() => setColor(el)}>
              <Lens sx={{ color: el[500] }} />
            </IconButton>
          ))}
          <Button
            size="large"
            // aria-label="current_user_account"
            aria-controls={languagesMenuId}
            // aria-haspopup="true"
            onClick={openLanguagesMenu}
            color="inherit"
            startIcon={
              <span className={`fi fi-${language}`}></span>
            }
          // className="profile-button"
          >
            {language === "gb" ? "EN" : language.toUpperCase()}
          </Button>
          <IconButton
            size="large"
            color="inherit"
            onClick={() => user ?
              navigate("/new-advertisement") :
              setIsLogInDialogOpen(true)
            }
          >
            <AddCircleOutlineIcon />
          </IconButton>
          {user ?
            <Button
              size="large"
              aria-label="current_user_account"
              aria-controls={accountMenuId}
              aria-haspopup="true"
              onClick={openAccountMenu}
              color="inherit"
              endIcon={
                <div className="account-image">
                  {user.image ?
                    <img src={`data:image/png;base64,${accountImage}`} /> :
                    <AccountCircle />
                  }
                </div>
              }
              className="profile-button"
            >
              {user.name}
            </Button> :
            <IconButton
              size="large"
              edge="end"
              aria-label="current_user_account"
              aria-controls={accountMenuId}
              aria-haspopup="true"
              onClick={() => setIsLogInDialogOpen(true)}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
          }
          {/* <Box sx={{ display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="show more"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              color="inherit"
            >
              <MoreIcon />
            </IconButton>
          </Box> */}
        </Toolbar>
      </AppBar>
      {/* {renderMobileMenu} */}
      {renderLanguagesMenu}
      {user && renderAccountMenu}
      <AccountDialog />
    </div>
  );
}

export default Header;