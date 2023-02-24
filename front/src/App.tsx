import { useContext, useState, useCallback, useEffect } from "react";

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Ad from "./components/Ad";
import Ads from "./components/Ads";
import Chats from "./components/Chats";
import GeneralInfo from "./components/GeneralInfo";
import Header from "./components/Header";
import NewAd from "./components/NewAd";
import Profile from "./components/Profile";
import MyAds from "./components/MyAds";
import { UserContext } from "./components/UserContext";
import "./App.scss";
import { createTheme, ThemeProvider } from "@mui/material";
import { orange } from "@mui/material/colors";
import logoBright from "./images/logo_bright.png";
import logoDark from "./images/logo_dark.png";
import EmailIsVerified from "./components/EmailIsVerified";
import GlobalStyles from "@mui/material/GlobalStyles/GlobalStyles";

const App = () => {
  const { user, isTokenValidationComplete } = useContext(UserContext);
  // const [palette, setPalette] = useState<Object>({});
  const [color, setColor] = useState<any>(orange);

  const createPalette = useCallback((color: any) => ({
    primary: {
      light: color[300],
      main: color[500],
      dark: color[700]
    },
    secondary: {
      light: color[50],
      main: color[100],
      dark: color[200]
    },
  }), [color]);

  const palette = createPalette(color);

  const globalStyles = {
    "*::-webkit-scrollbar-track": {
      backgroundColor: palette.secondary.main,
    },
    '*::-webkit-scrollbar-thumb': {
      backgroundColor: palette.secondary.dark,
      "&:hover": {
        backgroundColor: palette.primary.light,
      },
      "&:active": {
        backgroundColor: palette.primary.main,
      }
    },
  };

  const theme = createTheme({
    palette
  });

  return (
    <ThemeProvider theme={theme} >
      <GlobalStyles styles={globalStyles} />
      <Router>
        {isTokenValidationComplete &&
          <>
            <Header logo={color === orange ? logoDark : logoBright} color={color} setColor={setColor} />
            <Routes>
              <Route path="/" element={<Ads />} />
              <Route path="/ad/:id" element={<Ad />} />
              {user ?
                <>
                  <Route path="/new-advertisement" element={<NewAd />} />
                  <Route path="/profile" element={<Profile />}>
                    <Route path="general-info" element={<GeneralInfo />} />
                    <Route path="ads" element={<MyAds />} />
                    <Route path="chats" element={<Chats />} />
                  </Route>
                  <Route path="*" element={<Navigate to="/" />} />
                </> :
                <>
                  <Route path="/verify-email/:token" element={<EmailIsVerified />} />
                  <Route path="*" element={<Navigate to="/" />} />
                </>
              }
            </Routes>
          </>
        }
      </Router>
    </ThemeProvider >
  )
}

export default App;