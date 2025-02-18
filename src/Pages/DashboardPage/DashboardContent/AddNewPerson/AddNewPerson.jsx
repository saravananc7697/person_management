import {
  Box,
  Grid,
  InputLabel,
  TextField,
  Typography,
  FormControl,
  Select,
  MenuItem,
} from "@mui/material";
import React, { useState, useContext } from "react";
import { ApiContext } from "../../../../Context-data/ApiContext";
import dayjs from "dayjs";
import Stack from "@mui/material/Stack";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers";
import {
  gender,
  maritalstatus,
  ethnicity,
  religion,
  Confirmation,
} from "../../../../DummyObject/ObjectVal";
import CommonButton from "../../../../Components/CommonButton/CommonButton";
import HeadingText from "../../../../Components/CommonHeading/HeadingText";
import CommonLoader from "../../../../Components/CommonLoder/CommonLoader";
import ApiService from "../../../../Service/ApiService";
import { validatePerson } from "../../../../Validation/Validation";

const AddNewPerson = ({ rowId }) => {
  const { personData } = useContext(ApiContext);
  let rowData = null;
  if (rowId && typeof rowId === "number") {
    rowData = personData.find((person) => person.personid === rowId);
  }

  const defaultRowData = {
    firstname: "",
    lastname: "",
    gender: "",
    age: null,
    socialsecuritynumber: "",
    passportnumber: "",
    height: null,
    weight: null,
    bloodtype: "",
    occupation: "",
    maritalstatus: "",
    emergencycontactname: "",
    emergencycontactnumber: "",
    fathername: "",
    mothername: "",
    guardianname: "",
    guardianrelationship: "",
    guardianphonenumber: "",
    ethnicity: "",
    religion: "",
    languagesspoken: "",
    citizenship: "",
    disabilitystatus: "",
    disabilitydescription: "",
    healthconditions: "",
    allergies: "",
    medications: "",
    preferredcontactmethod: "",
  };

  const initialFormData = rowData
    ? { ...defaultRowData, ...rowData }
    : defaultRowData;

  const initialDateValues = {
    dateofbirth:
      rowData && rowData.dateofbirth ? dayjs(rowData.dateofbirth) : null,
  };
  const apiURL = process.env.REACT_APP_BASE_URL;
  const [formData, setFormData] = useState(initialFormData);
  const [loader, setLoader] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [dateValues, setDateValues] = useState(initialDateValues);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const numericFields = ["age", "height", "weight"];

    const parsedValue = numericFields.includes(name)
      ? parseInt(value, 10)
      : value;

    setFormData({
      ...formData,
      [name]: parsedValue,
    });

    setFormErrors({
      ...formErrors,
      [name]: "",
    });
  };

  const handleDateChange = (fieldName, newValue) => {
    const formattedDate = newValue !== null ? newValue : "";
    setDateValues((prevDateValues) => ({
      ...prevDateValues,
      [fieldName]: formattedDate,
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const formattedDateValues = {};

    Object.keys(dateValues).forEach((key) => {
      const dateValue = dateValues[key];
      if (dateValue) {
        if (key === "incidentDateAndTime") {
          formattedDateValues[key] = dateValue.format("YYYY-MM-DDTHH:mm:ss");
        } else {
          formattedDateValues[key] = dateValue.format("YYYY-MM-DD");
        }
      } else {
        formattedDateValues[key] = null;
      }
    });

    const errors = validatePerson(formData, formattedDateValues);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
    } else {
      setFormErrors({});
      setLoader(true);

      try {
        const apiUrl = `${apiURL}/person`;
        if (rowData && Object.keys(rowData).length !== 0 && rowData.personid) {
          const postData = {
            ...formData,
            ...formattedDateValues,
            personnumber: rowData.personnumber,
          };

          console.log(postData);
          // return false;
          postData.personid = rowData.personid;

          const responseData = await ApiService.request(
            "PUT",
            apiUrl,
            postData
          );
          console.log("person api Response (PUT):", responseData);
          alert("Person Updated Successfully!");
        } else {
          const postData2 = {
            ...formData,
            ...formattedDateValues,
          };

          console.log(postData2);
          // return false;
          const responseData = await ApiService.request(
            "POST",
            apiUrl,
            postData2
          );
          console.log("person api Response (POST):", responseData);
          alert("person Created Successfully!");
        }
        // window.location.reload();
      } catch (error) {
        console.error("Error occurred during POST request in Person:", error);
        setLoader(false);
        return alert("something went wrong");
      }
    }
  };

  const handleBack = () => {
    window.location.reload();
  };

  return (
    <div>
      <Box className="stylebox">
        <HeadingText headtext="Create New Person Kindly Fill all the details carefully" />
        <form id="AddNewPerson" onSubmit={handleFormSubmit}>
          <Grid
            container
            rowSpacing={1}
            columnSpacing={{ xs: 1, sm: 2, md: 3 }}
            className="innerformSpacing"
          >
            <Grid item xs={6}>
              <InputLabel>First Name</InputLabel>
              <TextField
                size="small"
                label=""
                name="firstname"
                value={formData.firstname}
                onChange={handleInputChange}
                fullWidth
                error={!!formErrors.firstname}
                helperText={formErrors.firstname || ""}
              />
            </Grid>
            <Grid item xs={6}>
              <InputLabel>Last Name</InputLabel>
              <TextField
                size="small"
                label=""
                name="lastname"
                value={formData.lastname}
                onChange={handleInputChange}
                fullWidth
                error={!!formErrors.lastname}
                helperText={formErrors.lastname || ""}
              />
            </Grid>
            <Grid item xs={6}>
              <InputLabel>Gender</InputLabel>
              <FormControl size="small" fullWidth>
                <Select
                  style={{ textAlign: "left" }}
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  variant="outlined"
                  label=""
                  error={!!formErrors.gender}
                  helperText={formErrors.gender || ""}
                >
                  {gender.map((genderOption) => (
                    <MenuItem key={genderOption} value={genderOption}>
                      {genderOption}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <InputLabel>Date Of Birth</InputLabel>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Stack>
                  <DatePicker
                    slotProps={{ textField: { size: "small" } }}
                    value={dateValues.dateofbirth}
                    onChange={(newValue) =>
                      handleDateChange("dateofbirth", newValue)
                    }
                    referenceDate={dayjs("2022-04-17")}
                    format="YYYY-MM-DD"
                    className="DateInput"
                  />
                </Stack>
              </LocalizationProvider>
              {formErrors.dateofbirth && (
                <Typography variant="body2" color="error">
                  {formErrors.dateofbirth}
                </Typography>
              )}
            </Grid>
            <Grid item xs={6}>
              <InputLabel>Age</InputLabel>
              <TextField
                size="small"
                label=""
                name="age"
                value={formData.age}
                onChange={handleInputChange}
                fullWidth
                type="number"
                error={!!formErrors.age}
                helperText={formErrors.age || ""}
              />
            </Grid>
            <Grid item xs={6}>
              <InputLabel>Passport Number</InputLabel>
              <TextField
                size="small"
                label=""
                name="passportnumber"
                value={formData.passportnumber}
                onChange={handleInputChange}
                fullWidth
                error={!!formErrors.passportnumber}
                helperText={formErrors.passportnumber || ""}
              />
            </Grid>
            <Grid item xs={6}>
              <InputLabel>Social Security Number</InputLabel>
              <TextField
                size="small"
                label=""
                name="socialsecuritynumber"
                value={formData.socialsecuritynumber}
                onChange={handleInputChange}
                fullWidth
                error={!!formErrors.socialsecuritynumber}
                helperText={formErrors.socialsecuritynumber || ""}
              />
            </Grid>
            <Grid item xs={6}>
              <InputLabel>Height</InputLabel>
              <TextField
                size="small"
                label=""
                name="height"
                value={formData.height}
                onChange={handleInputChange}
                fullWidth
                type="number"
                error={!!formErrors.height}
                helperText={formErrors.height || ""}
              />
            </Grid>
            <Grid item xs={6}>
              <InputLabel>Weight</InputLabel>
              <TextField
                size="small"
                label=""
                name="weight"
                value={formData.weight}
                onChange={handleInputChange}
                fullWidth
                type="number"
                error={!!formErrors.weight}
                helperText={formErrors.weight || ""}
              />
            </Grid>
            <Grid item xs={6}>
              <InputLabel>Blood Type</InputLabel>
              <TextField
                size="small"
                label=""
                name="bloodtype"
                value={formData.bloodtype}
                onChange={handleInputChange}
                fullWidth
                error={!!formErrors.bloodtype}
                helperText={formErrors.bloodtype || ""}
              />
            </Grid>
            <Grid item xs={6}>
              <InputLabel>occupation</InputLabel>
              <TextField
                size="small"
                label=""
                name="occupation"
                value={formData.occupation}
                onChange={handleInputChange}
                fullWidth
                error={!!formErrors.occupation}
                helperText={formErrors.occupation || ""}
              />
            </Grid>
            <Grid item xs={6}>
              <InputLabel>Marital Status</InputLabel>
              <FormControl size="small" fullWidth>
                <Select
                  style={{ textAlign: "left" }}
                  name="maritalstatus"
                  value={formData.maritalstatus}
                  onChange={handleInputChange}
                  variant="outlined"
                  label=""
                  error={!!formErrors.maritalstatus}
                  helperText={formErrors.maritalstatus || ""}
                >
                  {maritalstatus.map((maritalstatusOption) => (
                    <MenuItem
                      key={maritalstatusOption}
                      value={maritalstatusOption}
                    >
                      {maritalstatusOption}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <InputLabel>Emergency person Name</InputLabel>
              <TextField
                size="small"
                label=""
                name="emergencycontactname"
                value={formData.emergencycontactname}
                onChange={handleInputChange}
                fullWidth
                error={!!formErrors.emergencycontactname}
                helperText={formErrors.emergencycontactname || ""}
              />
            </Grid>
            <Grid item xs={6}>
              <InputLabel>Emergency Contact Number</InputLabel>
              <TextField
                size="small"
                label=""
                name="emergencycontactnumber"
                value={formData.emergencycontactnumber}
                onChange={handleInputChange}
                fullWidth
                type="number"
                error={!!formErrors.emergencycontactnumber}
                helperText={formErrors.emergencycontactnumber || ""}
              />
            </Grid>
            <Grid item xs={6}>
              <InputLabel>Father Name</InputLabel>
              <TextField
                size="small"
                label=""
                name="fathername"
                value={formData.fathername}
                onChange={handleInputChange}
                fullWidth
                error={!!formErrors.fathername}
                helperText={formErrors.fathername || ""}
              />
            </Grid>
            <Grid item xs={6}>
              <InputLabel>Mother Name</InputLabel>
              <TextField
                size="small"
                label=""
                name="mothername"
                value={formData.mothername}
                onChange={handleInputChange}
                fullWidth
                error={!!formErrors.mothername}
                helperText={formErrors.mothername || ""}
              />
            </Grid>
            <Grid item xs={6}>
              <InputLabel>Guardian Name</InputLabel>
              <TextField
                size="small"
                label=""
                name="guardianname"
                value={formData.guardianname}
                onChange={handleInputChange}
                fullWidth
                error={!!formErrors.guardianname}
                helperText={formErrors.guardianname || ""}
              />
            </Grid>
            <Grid item xs={6}>
              <InputLabel>Guardian Relationship</InputLabel>
              <TextField
                size="small"
                label=""
                name="guardianrelationship"
                value={formData.guardianrelationship}
                onChange={handleInputChange}
                fullWidth
                error={!!formErrors.guardianrelationship}
                helperText={formErrors.guardianrelationship || ""}
              />
            </Grid>
            <Grid item xs={6}>
              <InputLabel>Guardian Phone Number</InputLabel>
              <TextField
                size="small"
                label=""
                name="guardianphonenumber"
                value={formData.guardianphonenumber}
                onChange={handleInputChange}
                fullWidth
                error={!!formErrors.guardianphonenumber}
                helperText={formErrors.guardianphonenumber || ""}
                type="number"
              />
            </Grid>
            <Grid item xs={6}>
              <InputLabel>Ethnicity</InputLabel>
              <FormControl size="small" fullWidth>
                <Select
                  style={{ textAlign: "left" }}
                  name="ethnicity"
                  value={formData.ethnicity}
                  onChange={handleInputChange}
                  variant="outlined"
                  label=""
                  error={!!formErrors.ethnicity}
                  helperText={formErrors.ethnicity || ""}
                >
                  {ethnicity.map((ethnicityOption) => (
                    <MenuItem key={ethnicityOption} value={ethnicityOption}>
                      {ethnicityOption}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <InputLabel>Religion</InputLabel>
              <FormControl size="small" fullWidth>
                <Select
                  style={{ textAlign: "left" }}
                  name="religion"
                  value={formData.religion}
                  onChange={handleInputChange}
                  variant="outlined"
                  label=""
                  error={!!formErrors.religion}
                  helperText={formErrors.religion || ""}
                >
                  {religion.map((religionOption) => (
                    <MenuItem key={religionOption} value={religionOption}>
                      {religionOption}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <InputLabel>Languages Spoken</InputLabel>
              <TextField
                size="small"
                label=""
                name="languagesspoken"
                value={formData.languagesspoken}
                onChange={handleInputChange}
                fullWidth
                error={!!formErrors.languagesspoken}
                helperText={formErrors.languagesspoken || ""}
              />
            </Grid>
            <Grid item xs={6}>
              <InputLabel>Citizenship</InputLabel>
              <TextField
                size="small"
                label=""
                name="citizenship"
                value={formData.citizenship}
                onChange={handleInputChange}
                fullWidth
                error={!!formErrors.citizenship}
                helperText={formErrors.citizenship || ""}
              />
            </Grid>
            <Grid item xs={6}>
              <InputLabel>Disability Status</InputLabel>
              <FormControl size="small" fullWidth>
                <Select
                  style={{ textAlign: "left" }}
                  name="disabilitystatus"
                  value={formData.disabilitystatus}
                  onChange={handleInputChange}
                  variant="outlined"
                  label=""
                  error={!!formErrors.disabilitystatus}
                  helperText={formErrors.disabilitystatus || ""}
                >
                  {Confirmation.map((disabilitystatusOption) => (
                    <MenuItem
                      key={disabilitystatusOption}
                      value={disabilitystatusOption}
                    >
                      {disabilitystatusOption}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <InputLabel>Disabilityde Scription</InputLabel>
              <TextField
                size="small"
                label=""
                name="disabilitydescription"
                value={formData.disabilitydescription}
                onChange={handleInputChange}
                fullWidth
                error={!!formErrors.disabilitydescription}
                helperText={formErrors.disabilitydescription || ""}
              />
            </Grid>
            <Grid item xs={6}>
              <InputLabel>Health Conditions</InputLabel>
              <TextField
                size="small"
                label=""
                name="healthconditions"
                value={formData.healthconditions}
                onChange={handleInputChange}
                fullWidth
                error={!!formErrors.healthconditions}
                helperText={formErrors.healthconditions || ""}
              />
            </Grid>
            <Grid item xs={6}>
              <InputLabel>Allergies</InputLabel>
              <TextField
                size="small"
                label=""
                name="allergies"
                value={formData.allergies}
                onChange={handleInputChange}
                fullWidth
                error={!!formErrors.allergies}
                helperText={formErrors.allergies || ""}
              />
            </Grid>
            <Grid item xs={6}>
              <InputLabel>Medications</InputLabel>
              <TextField
                size="small"
                label=""
                name="medications"
                value={formData.medications}
                onChange={handleInputChange}
                fullWidth
                error={!!formErrors.medications}
                helperText={formErrors.medications || ""}
              />
            </Grid>
            <Grid item xs={6}>
              <InputLabel>Preferred Contact Method</InputLabel>
              <TextField
                size="small"
                label=""
                name="preferredcontactmethod"
                value={formData.preferredcontactmethod}
                onChange={handleInputChange}
                fullWidth
                error={!!formErrors.preferredcontactmethod}
                helperText={formErrors.preferredcontactmethod || ""}
              />
            </Grid>
          </Grid>
          <CommonButton
            Name2="Submit"
            Name1="Cancel"
            formId="AddNewPerson"
            handleBack={handleBack}
          />
        </form>
      </Box>
      {loader ? <CommonLoader /> : null}
    </div>
  );
};

export default AddNewPerson;
