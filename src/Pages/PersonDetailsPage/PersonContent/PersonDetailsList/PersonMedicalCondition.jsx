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
import { frequency } from "../../../../DummyObject/ObjectVal";
import HeadingText from "../../../../Components/CommonHeading/HeadingText";
import ApiService from "../../../../Service/ApiService";
import { validatePersonContact } from "../../../../Validation/Validation";
import dayjs from "dayjs";
import Stack from "@mui/material/Stack";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers";

const PersonMedicalCondition = ({ personID }) => {
  const { personMedicalCondition } = useContext(ApiContext);
  const isPersonIDValid = personID != null && personID !== "";
  const rowData =
    personMedicalCondition && isPersonIDValid
      ? personMedicalCondition.filter((person) => person.personid == personID)
      : [];

  // console.log(rowData);

  const defaultRowData = {
    conditionname: "",
    severity: "",
    notes: "",
    treatment: "",
    doctorname: "",
  };

  const initialFormData =
    rowData.length > 0 ? { ...defaultRowData, ...rowData[0] } : defaultRowData;

  const initialDateValues = {
    diagnosisdate: initialFormData.diagnosisdate
      ? dayjs(initialFormData.diagnosisdate)
      : null,
  };

  const hiddenKeys = ["id", "personid", "person", "conditionid"];
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [formErrors, setFormErrors] = useState({});
  const apiURL = process.env.REACT_APP_BASE_URL;
  const [dateValues, setDateValues] = useState(initialDateValues);
  const [editData, setEditData] = useState({});

  const handleEditClick = (objectId) => {
    const editedData = rowData.find(
      (person) => person.conditionid === objectId
    );
    setEditData(editedData);
    if (editedData) {
      setFormData({ ...defaultRowData, ...editedData });
      setDateValues({
        diagnosisdate: editedData.diagnosisdate
          ? dayjs(editedData.diagnosisdate)
          : null,
      });
      setOpen(true);
    }
  };

  const handleAddNewClick = () => {
    setFormData(defaultRowData);
    setOpen(true);
    setDateValues({
      diagnosisdate: null,
    });
  };

  const handleDeleteClick = (objectId) => {
    const apiUrl = `${apiURL}/MedicalCondition/${objectId}`;
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
    const numericFields = ["amount"];

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
        const apiUrl = `${apiURL}/MedicalCondition`;
        if (editData && editData.conditionid) {
          const postData = {
            ...formData,
            ...formattedDateValues,
          };
          postData.conditionid = editData.conditionid;
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
      {!personMedicalCondition ? (
        <CircularProgress />
      ) : (
        <Box>
          <Box>
            <CommonCards
              data={rowData}
              hiddenKeys={hiddenKeys}
              Name="Medical Condition  Details"
              handleEditClick={handleEditClick}
              handleDeleteClick={handleDeleteClick}
              idKeyName="conditionid"
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
              Add New Medical Condition 
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
              <HeadingText headtext="Medical Condition  Details" />
              <Grid
                container
                rowSpacing={1}
                columnSpacing={{ xs: 1, sm: 2, md: 3 }}
                className="form-box"
              >
                <Grid item xs={6}>
                  <InputLabel>Condition Name</InputLabel>
                  <TextField
                    label=""
                    variant="standard"
                    name="conditionname"
                    value={formData.conditionname}
                    onChange={handleInputChange}
                    fullWidth
                    error={!!formErrors.conditionname}
                    helperText={formErrors.conditionname || ""}
                  />
                </Grid>
                <Grid item xs={6}>
                  <InputLabel>Severity</InputLabel>
                  <TextField
                    label=""
                    variant="standard"
                    name="severity"
                    value={formData.severity}
                    onChange={handleInputChange}
                    fullWidth
                    error={!!formErrors.severity}
                    helperText={formErrors.severity || ""}
                  />
                </Grid>
                <Grid item xs={6}>
                  <InputLabel>Treatment</InputLabel>
                  <TextField
                    label=""
                    variant="standard"
                    name="treatment"
                    value={formData.treatment}
                    onChange={handleInputChange}
                    fullWidth
                    error={!!formErrors.treatment}
                    helperText={formErrors.treatment || ""}
                  />
                </Grid>
                <Grid item xs={6}>
                  <InputLabel>Doctor Name</InputLabel>
                  <TextField
                    label=""
                    variant="standard"
                    name="doctorname"
                    value={formData.doctorname}
                    onChange={handleInputChange}
                    fullWidth
                    error={!!formErrors.doctorname}
                    helperText={formErrors.doctorname || ""}
                  />
                </Grid>
                <Grid item xs={6}>
                  <InputLabel>Diagnosis Date</InputLabel>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <Stack>
                      <DatePicker
                        value={dateValues.diagnosisdate}
                        onChange={(newValue) =>
                          handleDateChange("diagnosisdate", newValue)
                        }
                        referenceDate={dayjs("2022-04-17")}
                        format="YYYY-MM-DD"
                         slotProps={{ textField: { size: "small", variant: "standard" }, }}
                        className="DateInput"
                      />
                    </Stack>
                  </LocalizationProvider>
                  {formErrors.diagnosisdate && (
                    <Typography variant="body2" color="error">
                      {formErrors.diagnosisdate}
                    </Typography>
                  )}
                </Grid>
                <Grid item xs={6}>
                  <InputLabel>Notes</InputLabel>
                  <TextField
                    label=""
                    variant="standard"
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    fullWidth
                    error={!!formErrors.notes}
                    helperText={formErrors.notes || ""}
                  />
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

export default PersonMedicalCondition;
