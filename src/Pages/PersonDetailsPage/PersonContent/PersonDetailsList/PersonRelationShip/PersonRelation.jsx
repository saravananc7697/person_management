import React, { useContext, useState } from "react";
import { ApiContext } from "../../../../../Context-data/ApiContext";
import CircularProgress from "@mui/material/CircularProgress";
import {
  Box,
  InputLabel,
  TextField,
  Card,
  Button,
  Grid,
  Typography,
  FormControl,
  Select,
  MenuItem,
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
import {
  Confirmation,
  Status,
  frequency,
} from "../../../../../DummyObject/ObjectVal";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import PersonSearchingBox from "../../../../../Components/CommonSearchingBox/PersonSearchingBox";
import RelationSearchingBox from "../../../../../Components/CommonSearchingBox/RelationSearchBox";

const PersonRelation = ({ personID }) => {
  const { personRelation } = useContext(ApiContext);

  const isPersonIDValid = personID != null && personID !== "";
  const rowData =
    personRelation && isPersonIDValid
      ? personRelation.filter((person) => person.personid == personID)
      : [];

  const defaultRowData = {
    relatedpersonid: null,
    relationshiptypeid: null,
    status: "",
    meetingfrequency: "",
    description: "",
    privacysettings: "",
    mutualconsent: "",
    relationshipstrength: "",
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
    "relationshipid",
    "relatedperson",
    "relationshiptype",
  ];
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [formErrors, setFormErrors] = useState({});
  const apiURL = process.env.REACT_APP_BASE_URL;
  const [dateValues, setDateValues] = useState(initialDateValues);
  const [editData, setEditData] = useState({});
  const [open1, setOpen1] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [personid, setPersonid] = useState("");
  const [relationshipTypeid, setRelationshipTypeid] = useState("");

  const handleIntakeIdChange = (value) => {
    setPersonid(value);
    setOpen1(false);
  };
  const handleRelationtypeChange = (value) => {
    setRelationshipTypeid(value);
    setOpen2(false);
  };

  const handleEditClick = (objectId) => {
    const editedData = rowData.find(
      (person) => person.relationshipid === objectId
    );
    setEditData(editedData);
    if (editedData) {
      console.log(editedData);
      setPersonid(editedData.personid);
      setRelationshipTypeid(editedData.relationshiptypeid);
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
    setPersonid("");
    setRelationshipTypeid("");
    setDateValues({
      startdate: null,
      enddate: null,
    });
  };

  const handleDeleteClick = (objectId) => {
    const apiUrl = `${apiURL}/relationship/${objectId}`;
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
    if (!personid) {
      errors.personid = "Person is required";
    }
    if (!relationshipTypeid) {
      errors.relationshipTypeid = "Relationship Type  is required";
    }
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
    } else {
      setFormErrors({});

      try {
        const apiUrl = `${apiURL}/relationship`;
        if (editData && editData.relationshipid) {
          const postData = {
            ...formData,
            ...formattedDateValues,
            relatedpersonid: personid,
            relationshipTypeid: relationshipTypeid,
          };
          postData.relationshipid = editData.relationshipid;
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
            relatedpersonid: personid,
            relationshipTypeid: relationshipTypeid,
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
  const handleSelectClick1 = () => {
    setOpen2(true);
  };

  return (
    <div>
      {!personRelation ? (
        <CircularProgress />
      ) : (
        <Box>
          <Box>
            <CommonCards
              data={rowData}
              hiddenKeys={hiddenKeys}
              Name="RelationShip Details"
              handleEditClick={handleEditClick}
              handleDeleteClick={handleDeleteClick}
              idKeyName="relationshipid"
              keyNameToAlert="relationshiptypeid"
              pageName="RelationshipType"
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
              Add New RelationShip
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
            <PersonSearchingBox handleIntakeIdChange={handleIntakeIdChange} />
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
                  <HeadingText headtext="RelationShip Details" />
                  <Grid
                    container
                    rowSpacing={1}
                    columnSpacing={{ xs: 1, sm: 2, md: 3 }}
                    className="form-box"
                  >
                    {/* <Grid item xs={6}>
                  <InputLabel>Person</InputLabel>
                  <FormControl fullWidth>
                    <Select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      variant="standard"
                      label=""
                      error={!!formErrors.status}
                      helperText={formErrors.status || ""}
                    >
                      {Status.map((statusOption) => (
                        <MenuItem
                          key={statusOption}
                          value={statusOption}
                        >
                          {statusOption}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid> */}
                    <Grid item xs={6}>
                      <InputLabel>Related Person</InputLabel>
                      <TextField
                        onClick={handleSelectClick}
                        fullWidth
                        variant="standard"
                        size="small"
                        error={!!formErrors.relatedpersonid}
                        helperText={formErrors.relatedpersonid || ""}
                        value={personid} // Set the intakeId value here
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
                      <InputLabel>Relationship Type</InputLabel>
                      <TextField
                        onClick={handleSelectClick1}
                        fullWidth
                        variant="standard"
                        size="small"
                        error={!!formErrors.relationshiptypeid}
                        helperText={formErrors.relationshiptypeid || ""}
                        value={relationshipTypeid} // Set the intakeId value here
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
                    <Grid item xs={6}>
                      <InputLabel>Status</InputLabel>
                      <FormControl fullWidth>
                        <Select
                          name="status"
                          value={formData.status}
                          onChange={handleInputChange}
                          variant="standard"
                          label=""
                          error={!!formErrors.status}
                          helperText={formErrors.status || ""}
                        >
                          {Status.map((statusOption) => (
                            <MenuItem key={statusOption} value={statusOption}>
                              {statusOption}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={6}>
                      <InputLabel>Meeting Frequency</InputLabel>
                      <FormControl fullWidth>
                        <Select
                          name="meetingfrequency"
                          value={formData.meetingfrequency}
                          onChange={handleInputChange}
                          variant="standard"
                          label=""
                          error={!!formErrors.meetingfrequency}
                          helperText={formErrors.meetingfrequency || ""}
                        >
                          {frequency.map((meetingfrequencyOption) => (
                            <MenuItem
                              key={meetingfrequencyOption}
                              value={meetingfrequencyOption}
                            >
                              {meetingfrequencyOption}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={6}>
                      <InputLabel>Mutual Consent</InputLabel>
                      <FormControl fullWidth>
                        <Select
                          name="mutualconsent"
                          value={formData.mutualconsent}
                          onChange={handleInputChange}
                          variant="standard"
                          label=""
                          error={!!formErrors.mutualconsent}
                          helperText={formErrors.mutualconsent || ""}
                        >
                          {Confirmation.map((mutualconsentOption) => (
                            <MenuItem
                              key={mutualconsentOption}
                              value={mutualconsentOption}
                            >
                              {mutualconsentOption}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={6}>
                      <InputLabel>Privacy Settings</InputLabel>
                      <TextField
                        label=""
                        variant="standard"
                        name="privacysettings"
                        value={formData.privacysettings}
                        onChange={handleInputChange}
                        fullWidth
                        error={!!formErrors.privacysettings}
                        helperText={formErrors.privacysettings || ""}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <InputLabel>Relationship Strength</InputLabel>
                      <TextField
                        label=""
                        variant="standard"
                        name="relationshipstrength"
                        value={formData.relationshipstrength}
                        onChange={handleInputChange}
                        fullWidth
                        error={!!formErrors.relationshipstrength}
                        helperText={formErrors.relationshipstrength || ""}
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
      {open2 ? (
        <CommonModal
          open={open2}
          onClose={() => setOpen2(false)}
          title="My Modal Title"
          content="Modal Content Goes Here"
        >
          <div className="formpopUp">
            <RelationSearchingBox
              handleRelationtypeChange={handleRelationtypeChange}
            />
          </div>
        </CommonModal>
      ) : null}
    </div>
  );
};

export default PersonRelation;
