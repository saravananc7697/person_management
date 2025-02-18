import React, { useContext, useState } from "react";
import { ApiContext } from "../../../../../Context-data/ApiContext";
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
import CommonCards from "../../../../../Components/CommonCards/CommonCards";
import AddIcon from "@mui/icons-material/Add";
import CommonButton from "../../../../../Components/CommonButton/CommonButton";
import CommonModal from "../../../../../Components/CommonModal/CommonModal";
import { Confirmation } from "../../../../../DummyObject/ObjectVal";
import HeadingText from "../../../../../Components/CommonHeading/HeadingText";
import ApiService from "../../../../../Service/ApiService";
import { validatePersonContact } from "../../../../../Validation/Validation";
import dayjs from "dayjs";
import Stack from "@mui/material/Stack";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers";

const PersonMedication = ({ personID }) => {
  const { personMedication, personMedicationList } = useContext(ApiContext);
  const isPersonIDValid = personID != null && personID !== "";
  const rowData =
    personMedication && isPersonIDValid
      ? personMedication.filter((person) => person.personid == personID)
      : [];

  // console.log(rowData);

  const defaultRowData = {
    medicationname: "",
    frequency: "",
    dosage: "",
    prescriber: "",
    reasonformedication: "",
    description: "",
    psychotropic: "",
    expunge: "",
  };

  const initialFormData =
    rowData.length > 0 ? { ...defaultRowData, ...rowData[0] } : defaultRowData;

  const initialDateValues = {
    startdate: initialFormData.startdate
      ? dayjs(initialFormData.startdate)
      : null,
    enddate: initialFormData.enddate ? dayjs(initialFormData.enddate) : null,
  };

  const hiddenKeys = [
    "id",
    "personid",
    "person",
    "medicationid",
    "medicationlists",
  ];
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [formErrors, setFormErrors] = useState({});
  const apiURL = process.env.REACT_APP_BASE_URL;
  const [dateValues, setDateValues] = useState(initialDateValues);
  const [editData, setEditData] = useState({});

  const handleEditClick = (objectId) => {
    const editedData = rowData.find(
      (person) => person.medicationid === objectId
    );
    setEditData(editedData);
    if (editedData) {
      setFormData({ ...defaultRowData, ...editedData });
      setDateValues({
        startdate: editedData.startdate ? dayjs(editedData.startdate) : null,
        enddate: editedData.enddate ? dayjs(editedData.enddate) : null,
      });
      setOpen(true);
    }
  };

  const handleAddNewClick = () => {
    setFormData(defaultRowData);
    setOpen(true);
    setDateValues({
      startdate: null,
      enddate: null,
    });
  };

  const handleDeleteClick = (objectId) => {
    const apiUrl = `${apiURL}/Medication/${objectId}`;
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
    const numericFields = ["latitude", "longitude", "floornumber"];

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
        const apiUrl = `${apiURL}/Medication`;
        if (editData && editData.medicationid) {
          const postData = {
            ...formData,
            ...formattedDateValues,
          };
          postData.medicationid = editData.medicationid;
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
      {!personMedication ? (
        <CircularProgress />
      ) : (
        <Box>
          <Box>
            <CommonCards
              data={rowData}
              hiddenKeys={hiddenKeys}
              Name="Medication Details"
              handleEditClick={handleEditClick}
              handleDeleteClick={handleDeleteClick}
              idKeyName="medicationid"
            />
          </Box>
          <Card className="ContextCard">
            <Button
              variant="contained"
              color="primary"
              className="addButton"
              startIcon={<AddIcon />}
              onClick={handleAddNewClick}
            >
              Add New Medication
            </Button>
          </Card>
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
              <HeadingText headtext="Medication Details" />
              <Grid
                container
                rowSpacing={1}
                columnSpacing={{ xs: 1, sm: 2, md: 3 }}
                className="form-box"
              >
                <Grid item xs={6}>
                  <InputLabel>Medication Name</InputLabel>
                  <TextField
                    label=""
                    variant="standard"
                    name="medicationname"
                    value={formData.medicationname}
                    onChange={handleInputChange}
                    fullWidth
                    error={!!formErrors.medicationname}
                    helperText={formErrors.medicationname || ""}
                  />
                </Grid>
                <Grid item xs={6}>
                  <InputLabel>Medication Name</InputLabel>
                  <TextField
                    label=""
                    variant="standard"
                    name="frequency"
                    value={formData.frequency}
                    onChange={handleInputChange}
                    fullWidth
                    error={!!formErrors.frequency}
                    helperText={formErrors.frequency || ""}
                  />
                </Grid>
                <Grid item xs={6}>
                  <InputLabel>Dosage</InputLabel>
                  <TextField
                    label=""
                    variant="standard"
                    name="dosage"
                    value={formData.dosage}
                    onChange={handleInputChange}
                    fullWidth
                    error={!!formErrors.dosage}
                    helperText={formErrors.dosage || ""}
                  />
                </Grid>
                <Grid item xs={6}>
                  <InputLabel>Prescriber</InputLabel>
                  <TextField
                    label=""
                    variant="standard"
                    name="prescriber"
                    value={formData.prescriber}
                    onChange={handleInputChange}
                    fullWidth
                    error={!!formErrors.prescriber}
                    helperText={formErrors.prescriber || ""}
                  />
                </Grid>
                <Grid item xs={6}>
                  <InputLabel>Reason For Medication</InputLabel>
                  <TextField
                    label=""
                    variant="standard"
                    name="reasonformedication"
                    value={formData.reasonformedication}
                    onChange={handleInputChange}
                    fullWidth
                    error={!!formErrors.reasonformedication}
                    helperText={formErrors.reasonformedication || ""}
                  />
                </Grid>
                <Grid item xs={6}>
                  <InputLabel>Description</InputLabel>
                  <TextField
                    label=""
                    variant="standard"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    fullWidth
                    error={!!formErrors.description}
                    helperText={formErrors.description || ""}
                  />
                </Grid>
                <Grid item xs={6}>
                  <InputLabel>Psychotropic</InputLabel>
                  <FormControl fullWidth>
                    <Select
                      name="psychotropic"
                      value={formData.psychotropic}
                      onChange={handleInputChange}
                      variant="standard"
                      label=""
                      error={!!formErrors.psychotropic}
                      helperText={formErrors.psychotropic || ""}
                    >
                      {Confirmation.map((psychotropicOption) => (
                        <MenuItem
                          key={psychotropicOption}
                          value={psychotropicOption}
                        >
                          {psychotropicOption}
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
                  <InputLabel>Start Date</InputLabel>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <Stack>
                      <DatePicker
                        value={dateValues.startdate}
                        onChange={(newValue) =>
                          handleDateChange("startdate", newValue)
                        }
                        referenceDate={dayjs("2022-04-17")}
                        format="YYYY-MM-DD"
                         slotProps={{ textField: { size: "small", variant: "standard" }, }}
                        className="DateInput"
                      />
                    </Stack>
                  </LocalizationProvider>
                  {formErrors.startdate && (
                    <Typography variant="body2" color="error">
                      {formErrors.startdate}
                    </Typography>
                  )}
                </Grid>
                <Grid item xs={6}>
                  <InputLabel>End Date</InputLabel>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <Stack>
                      <DatePicker
                        value={dateValues.enddate}
                        onChange={(newValue) =>
                          handleDateChange("enddate", newValue)
                        }
                        referenceDate={dayjs("2022-04-17")}
                        format="YYYY-MM-DD"
                         slotProps={{ textField: { size: "small", variant: "standard" }, }}
                        className="DateInput"
                      />
                    </Stack>
                  </LocalizationProvider>
                  {formErrors.enddate && (
                    <Typography variant="body2" color="error">
                      {formErrors.enddate}
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

export default PersonMedication;
