import { useEffect, useState } from 'react';
import axios from 'axios';
import { Alert, Button } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';

const EmailIsVerified = () => {
  const navigate = useNavigate();
  const params = useParams();

  useEffect(() => {
    axios
      .get(`/api/verify-email/${params.token}`)
      .catch(() => navigate("/"));
  }, []);

  return (
    <div className="email-is-verified-container">
      <Alert color="success" className="alert">
        Your Email is verified.
      </Alert>
      <Button variant="contained" onClick={() => navigate("/")}>
        Return to Home page
      </Button>
    </div>

  );
};

export default EmailIsVerified;