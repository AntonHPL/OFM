import { Alert, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const EmailIsVerified = () => {
  const navigate = useNavigate();

  return (
    <div className="email-is-verified-container">
      <Alert color="success" className="alert">
        Your Email is verified.
      </Alert>
      <Button variant="contained" onClick={() => navigate("/")}>Return to Home page</Button>
    </div>

  );
};

export default EmailIsVerified;