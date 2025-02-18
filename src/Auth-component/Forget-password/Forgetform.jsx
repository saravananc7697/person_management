import React, { useState } from "react";
import {
  TextField,
  Button,
  Link,
  Typography,
  Container,
  Alert,
} from "@mui/material";
import {
  validateUsername,
  validatePassword,
  validateVerificationCode,
} from "../../Validation/Validation";
import { forgotPassword } from "../../auth";
import { confirmPassword } from "../../auth";
import { useNavigate } from "react-router-dom";

const Forgetform = () => {
  const navigate = useNavigate();
  const [usernameError, setusernameError] = useState("");
  const [errors, setErrors] = useState({
    username1: "",
    confirmationCode: "",
    newPassword: "",
  });
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [sucessMsg, setSucessMsg] = useState("");
  const [username1, setUsername1] = useState("");
  const [confirmationCode, setConfirmationCode] = useState(null);
  const [newPassword, setNewPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateUsername(username)) {
      setusernameError("Please enter a valid username.");
      return;
    }

    try {
      await forgotPassword(username);
      setSuccess(true);
      setSucessMsg(
        "We've sent an email with instructions to reset your password."
      );
    } catch (err) {
      setError(err.message);
    }
  };

  // Rest Password with code/////////////////////
  const handleSubmit1 = async (e) => {
    e.preventDefault();
    setError("");

    const validationErrors = {};
    if (!validateUsername(username1)) {
      validationErrors.username1 = "Username is required";
    }

    if (!validatePassword(newPassword)) {
      validationErrors.newPassword =
        "Password must be at least 8 characters with special characters";
    }

    if (!validateVerificationCode(confirmationCode)) {
      validationErrors.confirmationCode = "code is required";
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      try {
        await confirmPassword(username1, confirmationCode, newPassword);
        setSuccess(true);
        alert(
          "PassWord Reset successful! You can now log in with your credentials. Go rock that app!"
        );
        navigate("/");
      } catch (err) {
        setError(err.message);
      }
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      {success ? (
        <div>
          <Typography variant="h5">Reset Password</Typography>
          <Alert severity="success">{sucessMsg}</Alert>
          {error && <Typography color="error">{error}</Typography>}
          <form onSubmit={handleSubmit1}>
            <TextField
              type="text"
              label="Username"
              placeholder="Username"
              value={username1}
              fullWidth
              margin="normal"
              onChange={(e) => {
                setUsername1(e.target.value);
                setErrors((prevErrors) => ({
                  ...prevErrors,
                  username1: "", // Clear username error when username changes
                }));
              }}
              error={!!errors.username1}
              helperText={errors.username1}
            />
            <TextField
              type="text"
              label="Confirmation code"
              placeholder="Confirmation code"
              value={confirmationCode}
              fullWidth
              margin="normal"
              onChange={(e) => {
                setConfirmationCode(e.target.value);
                setErrors((prevErrors) => ({
                  ...prevErrors,
                  confirmationCode: "", // Clear code error when code changes
                }));
              }}
              error={!!errors.confirmationCode}
              helperText={errors.confirmationCode}
            />
            <TextField
              type="password"
              label="New password"
              placeholder="New password"
              value={newPassword}
              fullWidth
              margin="normal"
              onChange={(e) => {
                setNewPassword(e.target.value);
                setErrors((prevErrors) => ({
                  ...prevErrors,
                  newPassword: "", // Clear code error when code changes
                }));
              }}
              error={!!errors.newPassword}
              helperText={errors.newPassword}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              className="authbtn"
            >
              Submit
            </Button>
          </form>
        </div>
      ) : (
        <div>
          <Typography variant="h5">Forgot Password</Typography>
          {error && <Alert severity="error">{error}</Alert>}
          <form onSubmit={handleSubmit}>
            <TextField
              label="username"
              variant="outlined"
              fullWidth
              margin="normal"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onFocus={() => setusernameError("")} // Clear username error when username field gains focus
              className="input"
              error={usernameError !== ""}
              helperText={usernameError}
            />

            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              className="authbtn"
            >
              Reset Password
            </Button>
            {error && <p>{error}</p>}
          </form>
          <Typography className="backbtn">
            <Link href="/" className="link">
              Back to Login
            </Link>
          </Typography>
        </div>
      )}
    </Container>
  );
};

export default Forgetform;
