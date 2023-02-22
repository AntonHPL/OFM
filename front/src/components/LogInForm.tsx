import { useState, useEffect, useContext, FC, FormEvent } from 'react';
import { Alert, Button, TextField, FormControlLabel, Checkbox, Link } from '@mui/material';
import axios from "axios";
import { UserContext } from './UserContext';
import { LogInFormPropsInterface, LogInFormInputsInterface, ErrorInterface } from "../types";
import { errorFound, resetErrors } from "../functions/functions";
import { useTranslation } from 'react-i18next';
import '../i18n';

const LogInForm: FC<LogInFormPropsInterface> = ({ isOpen, setIsSignUpDialogOpen, setLoading }) => {
  const { t }: { t: (value: string) => string } = useTranslation();
  const emptyInputs: LogInFormInputsInterface = {
    email: "",
    password: "",
  };
  const [inputs, setInputs] = useState<LogInFormInputsInterface>(emptyInputs);
  const [checked, setChecked] = useState(true);
  const [cookieAge, setCookieAge] = useState<number | null>(7 * 24 * 3600 * 1000);
  const [authorizationError, setAuthorizationError] = useState("");
  const [errors, setErrors] = useState<Array<ErrorInterface>>([]);

  const { setTokenValidation, setIsLogInDialogOpen: setIsDialogOpen } = useContext(UserContext);

  useEffect(() => {
    !isOpen && setInputs(emptyInputs);
  }, [isOpen]);

  const EF = (field: string): ErrorInterface | undefined => errorFound(errors, field);
  const RE = (field: string): void => resetErrors(errors, field, setErrors);

  const onSubmit = (e: FormEvent): void => {
    e.preventDefault();
    const errorsData: Array<ErrorInterface> = [];
    let errorText: string;
    Object.entries(inputs).map(([key, value]) => {
      if (!value) {
        switch (key) {
          case "email": errorText = t("logInForm.theEmailFieldIsEmpty"); break;
          case "password": errorText = t("logInForm.thePasswordFieldIsEmpty"); break;
        };
        errorsData.push({ field: key, errorText: errorText });
      };
    });
    setErrors(errorsData);
    if (!errorsData.length) {
      setLoading(true);
      setTokenValidation(false);
      axios
        .post("/api/log-in", { email: inputs.email, password: inputs.password, cookieAge: cookieAge })
        .then(() => {
          setTokenValidation(true);
          setIsDialogOpen(false);
          // navigate("/");
          setInputs(emptyInputs);
          setLoading(false);
        })
        .catch(error => {
          setAuthorizationError(error.response.data.message);
          setLoading(false);
        });
    };
  };

  const handleCookieAge = (): void => {
    checked ? setCookieAge(7 * 24 * 3600 * 1000) : setCookieAge(null);
    setChecked(!checked);
  };

  return (
    <form
      onSubmit={onSubmit}
      encType="multipart/form-data"
      className="log-in-form"
    >
      <TextField
        error={!!EF("email")}
        type="email"
        size="small"
        variant="outlined"
        value={inputs.email}
        autoComplete="off"
        placeholder={t("logInForm.enterYourEmail")}
        helperText={EF("email")?.errorText || ""}
        onChange={e => {
          authorizationError && setAuthorizationError("");
          RE("email");
          setInputs({ ...inputs, email: e.target.value });
        }}
        className="form-row"
      />
      <TextField
        error={!!EF("password")}
        type="password"
        size="small"
        variant="outlined"
        value={inputs.password}
        autoComplete="off"
        placeholder={t("logInForm.enterYourPassword")}
        helperText={EF("password")?.errorText || ""}
        onChange={e => {
          authorizationError && setAuthorizationError("");
          RE("password");
          setInputs({ ...inputs, password: e.target.value });
        }}
        className="form-row"
      />
      <FormControlLabel
        control={<Checkbox checked={checked} />}
        label={t("logInForm.rememberFor7Days")}
        onChange={handleCookieAge}
        className="form-control-label"
      />
      {authorizationError &&
        <Alert
          severity="error"
          className="alert"
        >
          {authorizationError}
        </Alert>
      }
      <Button
        type="submit"
        variant="contained"
      >
        {t("logInForm.continue")}
      </Button>
      <p className="prompt">
        {t("logInForm.dontHaveAnAccountYet")}&nbsp;
        <Link
          onClick={() => setIsSignUpDialogOpen(true)}
          underline="hover"
        >
          {t("logInForm.signUp")}
        </Link>
      </p>
    </form>
  );
};

export default LogInForm;