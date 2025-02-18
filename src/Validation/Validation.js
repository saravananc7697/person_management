export const selectValidation = (value) => {
  return value.trim() !== "";
};

export const validateEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export const validatePassword = (password) => {
  return (
    password.length >= 8 && /[!@#$%^&*()_+{}\[\]:;<>,.?~\-]/.test(password)
  );
};

export const validateUsername = (username) => {
  // Check if username is at least 3 characters long
  if (username.length < 3) {
    return false;
  }

  // Check if username contains only letters and numbers
  const alphanumericRegex = /^[a-zA-Z0-9]+$/;
  if (!alphanumericRegex.test(username)) {
    return false;
  }

  return true;
};

export const validateVerificationCode = (code) => {
  return /^\d{6}$/.test(code);
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Regular expression for basic email format validation

export const validatePerson = (formData, formattedDateValues) => {
  const errors = {};

  // if (!formData.firstname?.trim()) {
  //   errors.firstname = "Please complete this field";
  // }

  // if (!formData.lastname?.trim()) {
  //   errors.lastname = "Please complete this field";
  // }

  // if (
  //   formattedDateValues.dateValues === null ||
  //   formattedDateValues.dateValues === ""
  // ) {
  //   errors.dateValues = "Please Select a Date";
  // }


  return errors;
};

export const validatePersonContact = (formData) => {
  const errors = {};

  // if (!formData.emailid?.trim()) {
  //   errors.emailid = "Please complete this field";
  // }

  return errors;
};

