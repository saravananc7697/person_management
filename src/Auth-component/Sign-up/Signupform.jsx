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
  validateEmail,
  validatePassword,
  validateVerificationCode,
} from "../../Validation/Validation";
import { signUp } from "../../auth";
import { confirmSignUp } from "../../auth";
import { useNavigate } from "react-router-dom";

const RegistrationPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [username, setUsername] = useState("");
  const [code, setCode] = useState(null);
  const [sucessMsg, setSucessMsg] = useState("");

  const handleInputChange = (field, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      [field]: "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const validationErrors = {};
    if (!validateUsername(formData.username)) {
      validationErrors.username = "Username is required";
    }
    if (!validateEmail(formData.email)) {
      validationErrors.email = "Invalid email format";
    }
    if (!validatePassword(formData.password)) {
      validationErrors.password =
        "Password must be at least 8 characters with special characters";
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      try {
        await signUp(formData.username, formData.email, formData.password);
        setSuccess(true);
        setSucessMsg(
          "SignUp successful! Please check your email for the confirmation code."
        );
      } catch (err) {
        setError(err.message);
      }
    }
  };

  //   Confirm Sign Up code /////////////////////
  const handleSubmit1 = async (e) => {
    e.preventDefault();
    setError("");
    const validationErrors = {};

    if (!validateUsername(username)) {
      validationErrors.username = "Username is required";
    }
    if (!validateVerificationCode(code)) {
      validationErrors.code = "code is required";
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      try {
        await confirmSignUp(username, code);
        setSuccess(true);
        setSucessMsg(
          "Confirmation successful! You can now log in with your credentials. Go rock that app!"
        );
        alert(
          "Confirmation successful! You can now log in with your credentials. Go rock that app!"
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
          <Typography variant="h5">Confirm Sign Up</Typography>
          <Alert severity="success">{sucessMsg}</Alert>
          {error && <Alert severity="error">{error}</Alert>}
          <form onSubmit={handleSubmit1}>
            <TextField
              type="text"
              label="Username"
              placeholder="Username"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setErrors((prevErrors) => ({
                  ...prevErrors,
                  username: "", // Clear username error when username changes
                }));
              }}
              fullWidth
              margin="normal"
              error={!!errors.username}
              helperText={errors.username}
            />
            <TextField
              type="number"
              label="Confirmation code"
              placeholder="Confirmation code"
              value={code}
              onChange={(e) => {
                setCode(e.target.value);
                setErrors((prevErrors) => ({
                  ...prevErrors,
                  code: "", // Clear code error when code changes
                }));
              }}
              fullWidth
              margin="normal"
              error={!!errors.code}
              helperText={errors.code}
            />

            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              className="authbtn"
            >
              Confirm Sign Up
            </Button>
          </form>
        </div>
      ) : (
        <div>
          <Typography variant="h5">Sign Up</Typography>
          {error && <Alert severity="error">{error}</Alert>}
          <form onSubmit={handleSubmit}>
            <TextField
              label="Username"
              variant="outlined"
              fullWidth
              margin="normal"
              value={formData.username}
              onChange={(e) => handleInputChange("username", e.target.value)}
              error={!!errors.username}
              helperText={errors.username}
            />
            <TextField
              label="Email"
              variant="outlined"
              fullWidth
              margin="normal"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              error={!!errors.email}
              helperText={errors.email}
            />
            <TextField
              label="Password"
              variant="outlined"
              fullWidth
              margin="normal"
              type="password"
              value={formData.password}
              onChange={(e) => handleInputChange("password", e.target.value)}
              error={!!errors.password}
              helperText={errors.password}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              className="authbtn"
            >
              Sign Up
            </Button>
          </form>
          <Typography className="paraspace">
            Already have an account?{" "}
            <Link href="/" className="link">
              Login
            </Link>
          </Typography>
        </div>
      )}
    </Container>
  );
};

export default RegistrationPage;
