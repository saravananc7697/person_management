import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
  Link,
  Checkbox,
  FormControlLabel,
  Typography,
  Container,
  Alert,
} from "@mui/material";
import {
  validateUsername,
  validatePassword,
} from "../../Validation/Validation";
import { signIn } from "../../auth";

const SigninForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");

  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState({
    username: "",
    password: "",
  });

  useEffect(() => {
    const storedusername = localStorage.getItem("rememberedusername");
    const storedPassword = localStorage.getItem("rememberedPassword");
    if (storedusername && storedPassword) {
      setFormData({
        username: storedusername,
        password: storedPassword,
      });
    }
  }, []);

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

  const handleLogin = async () => {
    const { username, password } = formData;
    const validationErrors = {};

    if (!validateUsername(username)) {
      validationErrors.username = "Invalid username format";
    }
    if (!validatePassword(password)) {
      validationErrors.password = "Password must be at least 8 characters";
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      try {
        await signIn(formData.username, formData.password);
        // Redirect to the app's main page or dashboard
        if (rememberMe) {
          localStorage.setItem("rememberedusername", username);
          localStorage.setItem("rememberedPassword", password);
        } else {
          localStorage.removeItem("rememberedusername");
          localStorage.removeItem("rememberedPassword");
        }
        navigate("./dashboard");
      } catch (err) {
        setError(err.message);
      }
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <div className="signinform">
        <Typography variant="h5">Sign In</Typography>
        {error && <Alert severity="error">{error}</Alert>}
        <form>
          <TextField
            label="username"
            variant="outlined"
            fullWidth
            margin="normal"
            value={formData.username}
            onChange={(e) => handleInputChange("username", e.target.value)}
            error={!!errors.username}
            helperText={errors.username}
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
          <div className="other-links">
            <FormControlLabel
              control={
                <Checkbox
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
              }
              label="Remember me"
            />
            <Link href="/forgot-password" className="link">
              Forgot Password?
            </Link>
          </div>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleLogin}
            className="authbtn"
          >
            Login
          </Button>
          <p>
            Don't have an account?
            <Link href="/signup" className="link">
              Register here
            </Link>
          </p>
        </form>
      </div>
    </Container>
  );
};

export default SigninForm;
