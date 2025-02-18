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
import HeadingText from "../../../../../Components/CommonHeading/HeadingText";
import ApiService from "../../../../../Service/ApiService";
import { validatePersonContact } from "../../../../../Validation/Validation";
import dayjs from "dayjs";
import Stack from "@mui/material/Stack";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers";

const PersonEducation = ({ personID }) => {
  const { personEducation } = useContext(ApiContext);
  const isPersonIDValid = personID != null && personID !== "";
  const rowData =
    personEducation && isPersonIDValid
      ? personEducation.filter((person) => person.personid == personID)
      : [];

  // console.log(rowData);

  const defaultRowData = {
    coursename: "",
    major: "",
  };

  const initialFormData =
    rowData.length > 0 ? { ...defaultRowData, ...rowData[0] } : defaultRowData;

  const initialDateValues = {
    startyear: initialFormData.startyear
      ? dayjs(initialFormData.startyear)
      : null,
    graduationyear: initialFormData.graduationyear
      ? dayjs(initialFormData.graduationyear)
      : null,
  };

  const hiddenKeys = [
    "id",
    "personid",
    "person",
    "educationid",
    "schools",
    "universities",
  ];
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [formErrors, setFormErrors] = useState({});
  const apiURL = process.env.REACT_APP_BASE_URL;
  const [dateValues, setDateValues] = useState(initialDateValues);
  const [editData, setEditData] = useState({});

  const handleEditClick = (objectId) => {
    const editedData = rowData.find(
      (person) => person.educationid === objectId
    );
    setEditData(editedData);
    if (editedData) {
      setFormData({ ...defaultRowData, ...editedData });
      setDateValues({
        startyear: editedData.startyear ? dayjs(editedData.startyear) : null,
        graduationyear: editedData.graduationyear
          ? dayjs(editedData.graduationyear)
          : null,
      });
      setOpen(true);
    }
  };

  const handleAddNewClick = () => {
    setFormData(defaultRowData);
    setOpen(true);
    setDateValues({
      startyear: null,
      graduationyear: null,
    });
  };

  const handleDeleteClick = (objectId) => {
    const apiUrl = `${apiURL}/Education/${objectId}`;
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
        const apiUrl = `${apiURL}/Education`;
        if (editData && editData.educationid) {
          const postData = {
            ...formData,
            ...formattedDateValues,
          };
          postData.educationid = editData.educationid;
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
      {!personEducation ? (
        <CircularProgress />
      ) : (
        <Box>
          <Box>
            <CommonCards
              data={rowData}
              hiddenKeys={hiddenKeys}
              Name="Education Details"
              handleEditClick={handleEditClick}
              handleDeleteClick={handleDeleteClick}
              idKeyName="educationid"
              keyNameToAlert="schoolid"
              pageName="School"
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
              Add New Education
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
              <HeadingText headtext="Education Details" />
              <Grid
                container
                rowSpacing={1}
                columnSpacing={{ xs: 1, sm: 2, md: 3 }}
                className="form-box"
              >
                <Grid item xs={6}>
                  <InputLabel>Course Name</InputLabel>
                  <TextField
                    label=""
                    variant="standard"
                    name="coursename"
                    value={formData.coursename}
                    onChange={handleInputChange}
                    fullWidth
                    error={!!formErrors.coursename}
                    helperText={formErrors.coursename || ""}
                  />
                </Grid>
                <Grid item xs={6}>
                  <InputLabel>Major Name</InputLabel>
                  <TextField
                    label=""
                    variant="standard"
                    name="major"
                    value={formData.major}
                    onChange={handleInputChange}
                    fullWidth
                    error={!!formErrors.major}
                    helperText={formErrors.major || ""}
                  />
                </Grid>
                <Grid item xs={6}>
                  <InputLabel>Start Year</InputLabel>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <Stack>
                      <DatePicker
                        value={dateValues.startyear}
                        onChange={(newValue) =>
                          handleDateChange("startyear", newValue)
                        }
                        referenceDate={dayjs("2022-04-17")}
                        format="YYYY-MM-DD"
                         slotProps={{ textField: { size: "small", variant: "standard" }, }}
                        className="DateInput"
                      />
                    </Stack>
                  </LocalizationProvider>
                  {formErrors.startyear && (
                    <Typography variant="body2" color="error">
                      {formErrors.startyear}
                    </Typography>
                  )}
                </Grid>
                <Grid item xs={6}>
                  <InputLabel>Graduation Year</InputLabel>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <Stack>
                      <DatePicker
                        value={dateValues.graduationyear}
                        onChange={(newValue) =>
                          handleDateChange("graduationyear", newValue)
                        }
                        referenceDate={dayjs("2022-04-17")}
                        format="YYYY-MM-DD"
                         slotProps={{ textField: { size: "small", variant: "standard" }, }}
                        className="DateInput"
                      />
                    </Stack>
                  </LocalizationProvider>
                  {formErrors.graduationyear && (
                    <Typography variant="body2" color="error">
                      {formErrors.graduationyear}
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

export default PersonEducation;
