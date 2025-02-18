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
import { EmpType } from "../../../../../DummyObject/ObjectVal";
import HeadingText from "../../../../../Components/CommonHeading/HeadingText";
import ApiService from "../../../../../Service/ApiService";
import { validatePersonContact } from "../../../../../Validation/Validation";
import dayjs from "dayjs";
import Stack from "@mui/material/Stack";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import OrgSearchingBox from "../../../../../Components/CommonSearchingBox/OrgSearchingBox";

const PersonEmployement = ({ personID }) => {
  const { personEmployment } = useContext(ApiContext);
  const isPersonIDValid = personID != null && personID !== "";
  const rowData =
    personEmployment && isPersonIDValid
      ? personEmployment.filter((person) => person.personid == personID)
      : [];

  // console.log(rowData);

  const defaultRowData = {
    personid: null,
    jobtitle: "",
    employmenttype: "",
    responsibilities: "",
    organizationid: "",
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
    "employmentid",
    "schools",
    "universities",
  ];
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [formErrors, setFormErrors] = useState({});
  const apiURL = process.env.REACT_APP_BASE_URL;
  const [dateValues, setDateValues] = useState(initialDateValues);
  const [editData, setEditData] = useState({});
  const [open1, setOpen1] = useState(false);
  const [Orgid, setOrgid] = useState("");

  const handleOrgChange = (value) => {
    setOrgid(value);
    setOpen1(false);
  };

  const handleEditClick = (objectId) => {
    const editedData = rowData.find(
      (person) => person.employmentid === objectId
    );
    setEditData(editedData);
    if (editedData) {
      setOrgid(editedData.organizationid);

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
    setOrgid("");
    setDateValues({
      startdate: null,
      enddate: null,
    });
  };

  const handleDeleteClick = (objectId) => {
    const apiUrl = `${apiURL}/Employment/${objectId}`;
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
    if (!Orgid) {
      errors.Orgid = "Person is required";
    }
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
    } else {
      setFormErrors({});

      try {
        const apiUrl = `${apiURL}/Employment`;
        if (editData && editData.employmentid) {
          const postData = {
            ...formData,
            ...formattedDateValues,
            organizationid: Orgid,
          };
          postData.employmentid = editData.employmentid;
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
            organizationid: Orgid,
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

  const handleSelectClick = () => {
    setOpen1(true);
  };

  return (
    <div>
      {!personEmployment ? (
        <CircularProgress />
      ) : (
        <Box>
          <Box>
            <CommonCards
              data={rowData}
              hiddenKeys={hiddenKeys}
              Name="Employment Details"
              handleEditClick={handleEditClick}
              handleDeleteClick={handleDeleteClick}
              idKeyName="employmentid"
              keyNameToAlert="organizationid"
              pageName="Organization"
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
              Add New Employment
            </Button>
          </Card>
        </Box>
      )}
      {open1 ? (
        <CommonModal
          open={open1}
          onClose={() => setOpen1(false)}
          title="My Modal Title"
          content="Modal Content Goes Here"
        >
          <div className="formpopUp">
            <OrgSearchingBox handleOrgChange={handleOrgChange} />
          </div>
        </CommonModal>
      ) : (
        <div>
          {open ? (
            <CommonModal
              open={open}
              onClose={() => setOpen(false)}
              title="My Modal Title"
              content="Modal Content Goes Here"
            >
              <Box className="contentBox">
                <form id="form" onSubmit={handleFormSubmit}>
                  <HeadingText headtext="Employment Details" />
                  <Grid
                    container
                    rowSpacing={1}
                    columnSpacing={{ xs: 1, sm: 2, md: 3 }}
                    className="form-box"
                  >
                    <Grid item xs={6}>
                      <InputLabel>Organization</InputLabel>
                      <TextField
                        onClick={handleSelectClick}
                        fullWidth
                        variant="standard"
                        size="small"
                        error={!!formErrors.organizationid}
                        helperText={formErrors.organizationid || ""}
                        value={Orgid} // Set the intakeId value here
                        InputProps={{
                          readOnly: true,
                          endAdornment: (
                            <IconButton edge="end">
                              <SearchIcon />
                            </IconButton>
                          ),
                        }}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <InputLabel>Job Title</InputLabel>
                      <TextField
                        label=""
                        variant="standard"
                        name="jobtitle"
                        value={formData.jobtitle}
                        onChange={handleInputChange}
                        fullWidth
                        error={!!formErrors.jobtitle}
                        helperText={formErrors.jobtitle || ""}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <InputLabel>Employmen Type</InputLabel>
                      <FormControl fullWidth>
                        <Select
                          name="employmenttype"
                          value={formData.employmenttype}
                          onChange={handleInputChange}
                          variant="standard"
                          label=""
                          error={!!formErrors.employmenttype}
                          helperText={formErrors.employmenttype || ""}
                        >
                          {EmpType.map((employmenttypeOption) => (
                            <MenuItem
                              key={employmenttypeOption}
                              value={employmenttypeOption}
                            >
                              {employmenttypeOption}
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
                            slotProps={{
                              textField: { size: "small", variant: "standard" },
                            }}
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
                            slotProps={{
                              textField: { size: "small", variant: "standard" },
                            }}
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
                    <Grid item xs={6}>
                      <InputLabel>Responsibilities</InputLabel>
                      <TextField
                        label=""
                        variant="standard"
                        name="responsibilities"
                        value={formData.responsibilities}
                        onChange={handleInputChange}
                        fullWidth
                        error={!!formErrors.responsibilities}
                        helperText={formErrors.responsibilities || ""}
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
      )}
    </div>
  );
};

export default PersonEmployement;
