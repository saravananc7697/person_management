import React, { useContext, useState } from "react";
import { ApiContext } from "../../../../Context-data/ApiContext";
import CircularProgress from "@mui/material/CircularProgress";
import {
  Box,
  InputLabel,
  TextField,
  FormControl,
  Select,
  MenuItem,
  Card,
  Button,
  Grid,
  Typography,
} from "@mui/material";
import CommonCards from "../../../../Components/CommonCards/CommonCards";
import AddIcon from "@mui/icons-material/Add";
import CommonButton from "../../../../Components/CommonButton/CommonButton";
import CommonModal from "../../../../Components/CommonModal/CommonModal";
import {
  identifiertype,
  Confirmation,
  residentialtype,
  addresstype,
} from "../../../../DummyObject/ObjectVal";
import HeadingText from "../../../../Components/CommonHeading/HeadingText";
import ApiService from "../../../../Service/ApiService";
import { validatePersonContact } from "../../../../Validation/Validation";
import dayjs from "dayjs";
import Stack from "@mui/material/Stack";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers";

const PersonGovDetails = ({ personID }) => {
  const { personGov } = useContext(ApiContext);
  const isPersonIDValid = personID != null && personID !== "";
  const rowData =
    personGov && isPersonIDValid
      ? personGov.filter((person) => person.personid == personID)
      : [];


  const defaultRowData = {
    passportnumber: "",
    socialsecuritynumber: "",
    driverlicensenumber: "",
    nationalidnumber: "",
    taxidnumber: "",
    identifiertype: "",
    identifiernumber: "",
    identifiernotes: "",
    isactiveidentifier: "",
    expunge: "",
    verificationtype: "",
  };

  const initialFormData =
    rowData.length > 0 ? { ...defaultRowData, ...rowData[0] } : defaultRowData;

  const initialDateValues = {
    identifierstartdate: initialFormData.identifierstartdate
      ? dayjs(initialFormData.identifierstartdate)
      : null,
    identifierenddate: initialFormData.identifierenddate
      ? dayjs(initialFormData.identifierenddate)
      : null,
  };

  const hiddenKeys = ["id", "personid", "person", "identifierid"];
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [formErrors, setFormErrors] = useState({});
  const apiURL = process.env.REACT_APP_BASE_URL;
  const [dateValues, setDateValues] = useState(initialDateValues);
  const [editData, setEditData] = useState({});

  const handleEditClick = (objectId) => {
    const editedData = rowData.find(
      (person) => person.identifierid === objectId
    );
    setEditData(editedData);
    if (editedData) {
      setFormData({ ...defaultRowData, ...editedData });
      setDateValues({
        identifierstartdate: editedData.identifierstartdate
          ? dayjs(editedData.identifierstartdate)
          : null,
        identifierenddate: editedData.identifierenddate
          ? dayjs(editedData.identifierenddate)
          : null,
      });
      setOpen(true);
    }
  };

  const handleAddNewClick = () => {
    setFormData(defaultRowData);
    setOpen(true);
    setDateValues({
      identifierstartdate: null,
      identifierenddate: null,
    });
  };

  const handleDeleteClick = (objectId) => {
    const apiUrl = `${apiURL}/personalIdentifier/${objectId}`;
    ApiService.request("DELETE", apiUrl)
      .then((data) => {
        alert("Data Deleted Sucessfully");
        window.location.reload();
      })
      .catch((error) => {
        alert("Something Went Wrong Please try after some time");
      });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const numericFields = [];

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

    const errors = validatePersonContact(formData);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
    } else {
      setFormErrors({});

      try {
        const apiUrl = `${apiURL}/personalIdentifier`;
        if (editData && editData.identifierid) {
          const postData = {
            ...formData,
            ...formattedDateValues,
          };
          postData.identifierid = editData.identifierid;
          console.log(postData);
          const responseData = await ApiService.request(
            "PUT",
            apiUrl,
            postData
          );
          console.log("person api Response (PUT):", responseData);
          alert("Data Updated Successfully!");
        } else {
          const postData2 = {
            ...formData,
            ...formattedDateValues,
            personid: personID,
          };
          console.log(postData2);
          const responseData = await ApiService.request(
            "POST",
            apiUrl,
            postData2
          );
          console.log("person api Response (POST):", responseData);
          alert("Data Created Successfully!");
        }
        window.location.reload();
      } catch (error) {
        console.error("Error occurred during request in Person:", error);
        return alert("something went wrong");
      }
    }
  };

  return (
    <div>
      {!personGov ? (
        <CircularProgress />
      ) : (
        <Box>
          <Box>
            <CommonCards
              data={rowData}
              hiddenKeys={hiddenKeys}
              Name="Identity Details"
              handleEditClick={handleEditClick}
              handleDeleteClick={handleDeleteClick}
              idKeyName="identifierid"
            />
          </Box>
          {rowData.length === 0 && (
            <Card className="ContextCard">
              <Button
                variant="contained"
                color="primary"
                className="addButton"
                startIcon={<AddIcon />}
                onClick={handleAddNewClick}
              >
                Add New Identity Details
              </Button>
            </Card>
          )}
        </Box>
      )}
      {open ? (
        <CommonModal
          open={open}
          onClose={() => setOpen(false)}
          title="My Modal Title"
          content="Modal Content Goes Here"
        >
          <Box className="contentBox">
            <form id="form" onSubmit={handleFormSubmit}>
              <HeadingText headtext="Identity Details" />
              <Grid
                container
                rowSpacing={1}
                columnSpacing={{ xs: 1, sm: 2, md: 3 }}
                className="form-box"
              >
                <Grid item xs={6}>
                  <InputLabel>passportnumber</InputLabel>
                  <TextField
                    label=""
                    variant="standard"
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
                    label=""
                    variant="standard"
                    name="socialsecuritynumber"
                    value={formData.socialsecuritynumber}
                    onChange={handleInputChange}
                    fullWidth
                    error={!!formErrors.socialsecuritynumber}
                    helperText={formErrors.socialsecuritynumber || ""}
                  />
                </Grid>
                <Grid item xs={6}>
                  <InputLabel>Driver License Number</InputLabel>
                  <TextField
                    label=""
                    variant="standard"
                    name="driverlicensenumber"
                    value={formData.driverlicensenumber}
                    onChange={handleInputChange}
                    fullWidth
                    error={!!formErrors.driverlicensenumber}
                    helperText={formErrors.driverlicensenumber || ""}
                  />
                </Grid>
                <Grid item xs={6}>
                  <InputLabel>National Id Number</InputLabel>
                  <TextField
                    label=""
                    variant="standard"
                    name="nationalidnumber"
                    value={formData.nationalidnumber}
                    onChange={handleInputChange}
                    fullWidth
                    error={!!formErrors.nationalidnumber}
                    helperText={formErrors.nationalidnumber || ""}
                  />
                </Grid>
                <Grid item xs={6}>
                  <InputLabel>Tax Id Number</InputLabel>
                  <TextField
                    label=""
                    variant="standard"
                    name="taxidnumber"
                    value={formData.taxidnumber}
                    onChange={handleInputChange}
                    fullWidth
                    error={!!formErrors.taxidnumber}
                    helperText={formErrors.taxidnumber || ""}
                  />
                </Grid>
                <Grid item xs={6}>
                  <InputLabel>Identifier Type</InputLabel>
                  <FormControl fullWidth>
                    <Select
                      name="identifiertype"
                      value={formData.identifiertype}
                      onChange={handleInputChange}
                      variant="standard"
                      label=""
                      error={!!formErrors.identifiertype}
                      helperText={formErrors.identifiertype || ""}
                    >
                      {identifiertype.map((identifiertypeOption) => (
                        <MenuItem
                          key={identifiertypeOption}
                          value={identifiertypeOption}
                        >
                          {identifiertypeOption}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={6}>
                  <InputLabel>Identifier Number</InputLabel>
                  <TextField
                    label=""
                    variant="standard"
                    name="identifiernumber"
                    value={formData.identifiernumber}
                    onChange={handleInputChange}
                    fullWidth
                    error={!!formErrors.identifiernumber}
                    helperText={formErrors.identifiernumber || ""}
                  />
                </Grid>
                <Grid item xs={6}>
                  <InputLabel>Identifier Notes</InputLabel>
                  <TextField
                    label=""
                    variant="standard"
                    name="identifiernotes"
                    value={formData.identifiernotes}
                    onChange={handleInputChange}
                    fullWidth
                    error={!!formErrors.identifiernotes}
                    helperText={formErrors.identifiernotes || ""}
                  />
                </Grid>
                <Grid item xs={6}>
                  <InputLabel>Is Identifier Active</InputLabel>
                  <FormControl fullWidth>
                    <Select
                      name="isactiveidentifier"
                      value={formData.isactiveidentifier}
                      onChange={handleInputChange}
                      variant="standard"
                      label=""
                      error={!!formErrors.isactiveidentifier}
                      helperText={formErrors.isactiveidentifier || ""}
                    >
                      {Confirmation.map((isactiveidentifierOption) => (
                        <MenuItem
                          key={isactiveidentifierOption}
                          value={isactiveidentifierOption}
                        >
                          {isactiveidentifierOption}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={6}>
                  <InputLabel>Expunge</InputLabel>
                  <FormControl fullWidth>
                    <Select
                      name="expunge"
                      value={formData.expunge}
                      onChange={handleInputChange}
                      variant="standard"
                      label=""
                      error={!!formErrors.expunge}
                      helperText={formErrors.expunge || ""}
                    >
                      {Confirmation.map((expungeOption) => (
                        <MenuItem key={expungeOption} value={expungeOption}>
                          {expungeOption}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={6}>
                  <InputLabel>Verification Type</InputLabel>
                  <TextField
                    label=""
                    variant="standard"
                    name="verificationtype"
                    value={formData.verificationtype}
                    onChange={handleInputChange}
                    fullWidth
                    error={!!formErrors.verificationtype}
                    helperText={formErrors.verificationtype || ""}
                  />
                </Grid>
                <Grid item xs={6}>
                  <InputLabel>Identifier Start Date</InputLabel>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <Stack>
                      <DatePicker
                        value={dateValues.identifierstartdate}
                        onChange={(newValue) =>
                          handleDateChange("identifierstartdate", newValue)
                        }
                        referenceDate={dayjs("2022-04-17")}
                        format="YYYY-MM-DD"
                        slotProps={{
                          textField: { size: "small", variant: "standard" },
                        }}
                        className="DateInput"
                      />
                    </Stack>
                  </LocalizationProvider>
                  {formErrors.identifierstartdate && (
                    <Typography variant="body2" color="error">
                      {formErrors.identifierstartdate}
                    </Typography>
                  )}
                </Grid>
                <Grid item xs={6}>
                  <InputLabel>Identifier End Date</InputLabel>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <Stack>
                      <DatePicker
                        value={dateValues.identifierenddate}
                        onChange={(newValue) =>
                          handleDateChange("identifierenddate", newValue)
                        }
                        referenceDate={dayjs("2022-04-17")}
                        format="YYYY-MM-DD"
                        slotProps={{
                          textField: { size: "small", variant: "standard" },
                        }}
                        className="DateInput"
                      />
                    </Stack>
                  </LocalizationProvider>
                  {formErrors.identifierenddate && (
                    <Typography variant="body2" color="error">
                      {formErrors.identifierenddate}
                    </Typography>
                  )}
                </Grid>
              </Grid>
              <CommonButton
                Name2="Submit"
                Name1="Cancel"
                formId="form"
                handleBack={() => setOpen(false)}
              />
            </form>
          </Box>
        </CommonModal>
      ) : null}
    </div>
  );
};

export default PersonGovDetails;
