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

  // const getDesignTokens = (mode: PaletteMode) => ({
  //   palette: {
  //     mode,
  //     ...(mode === "light" ? orangePalette : indigoPalette)
  //   }
  // });

  // const theme = useMemo(() => createTheme(getDesignTokens(mode)), [mode]);

  const theme = createTheme({ palette: palette });

  return (
    <ThemeProvider theme={theme}>
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
                  <Route path="/email-is-verified" element={<EmailIsVerified />} />
                  <Route path="*" element={<Navigate to="/" />} />
                </>
              }
            </Routes>
          </>
        }
      </Router>
    </ThemeProvider>
  )
}

export default App;