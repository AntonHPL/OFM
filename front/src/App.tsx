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
import { Box, createTheme, ThemeProvider } from "@mui/material";
import { orange } from "@mui/material/colors";
import logoBright from "./images/logo_bright.png";
import logoDark from "./images/logo_dark.png";
import EmailIsVerified from "./components/EmailIsVerified";
import { makeStyles } from "@mui/styles";

const App = () => {
  const { user, isTokenValidationComplete } = useContext(UserContext);
  // const [palette, setPalette] = useState<Object>({});
  const [color, setColor] = useState<any>(orange);

  const useStyles = makeStyles(() => ({
    root: {
      "&::-webkit-scrollbar": {
        width: 7,
      },
      "&::-webkit-scrollbar-track": {
        boxShadow: `inset 0 0 6px rgba(0, 0, 0, 0.3)`,
      },
      "&::-webkit-scrollbar-thumb": {
        backgroundColor: "darkgrey",
        outline: `1px solid slategrey`,
      },
    },
  }));
  const classes = useStyles();
  console.log(useStyles)

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

  const theme = createTheme({
    components: {
      MuiCssBaseline: {
        styleOverrides: (themeParam) => ({
          body: darkScrollbar(),
        }),
      },
    },
  });

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
                  <Route path="/verify-email/:token" element={<EmailIsVerified />} />
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