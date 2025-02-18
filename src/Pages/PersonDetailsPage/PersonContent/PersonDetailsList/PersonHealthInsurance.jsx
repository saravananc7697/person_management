import React, { useContext, useEffect, useState } from "react";
import { ApiContext } from "../../../../Context-data/ApiContext";
import CircularProgress from "@mui/material/CircularProgress";
import {
  Box,
  InputLabel,
  TextField,
  Card,
  Button,
  Grid,
  Typography,
} from "@mui/material";
import CommonCards from "../../../../Components/CommonCards/CommonCards";
import AddIcon from "@mui/icons-material/Add";
import CommonButton from "../../../../Components/CommonButton/CommonButton";
import CommonModal from "../../../../Components/CommonModal/CommonModal";
import HeadingText from "../../../../Components/CommonHeading/HeadingText";
import ApiService from "../../../../Service/ApiService";
import { validatePersonContact } from "../../../../Validation/Validation";
import dayjs from "dayjs";
import Stack from "@mui/material/Stack";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers";
import PersonSearchingBox from "../../../../Components/CommonSearchingBox/PersonSearchingBox";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";

const PersonHealthInsurance = ({ personID }) => {
  const { personHealthInsurance } = useContext(ApiContext);
  const isPersonIDValid = personID != null && personID !== "";
  const rowData =
    personHealthInsurance && isPersonIDValid
      ? personHealthInsurance.filter((person) => person.personid == personID)
      : [];

  const defaultRowData = {
    insuranceprovider: "",
    policynumber: "",
    groupnumber: "",
    plantype: "",
    primarycarephysician: "",
    specialist: "",
    monthlypremium: null,
    deductible: null,
    copay: null,
    coinsurance: null,
    nomineeid: "",
  };

  const initialFormData =
    rowData.length > 0 ? { ...defaultRowData, ...rowData[0] } : defaultRowData;

  const initialDateValues = {
    coveragestartdate: initialFormData.coveragestartdate
      ? dayjs(initialFormData.coveragestartdate)
      : null,
    coverageenddate: initialFormData.coverageenddate
      ? dayjs(initialFormData.coverageenddate)
      : null,
  };

  const hiddenKeys = ["nominee", "personid", "person", "healthinsuranceid"];
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [formErrors, setFormErrors] = useState({});
  const apiURL = process.env.REACT_APP_BASE_URL;
  const [dateValues, setDateValues] = useState(initialDateValues);
  const [editData, setEditData] = useState({});
  const [open1, setOpen1] = useState(false);
  const [personid, setPersonid] = useState("");

  const handleIntakeIdChange = (value) => {
    setPersonid(value);
    setOpen1(false);
  };

  const handleEditClick = (objectId) => {
    const editedData = rowData.find(
      (person) => person.healthinsuranceid === objectId
    );
    setEditData(editedData);
    if (editedData) {
      setPersonid(editedData.personid);
      setFormData({ ...defaultRowData, ...editedData });
      setDateValues({
        coveragestartdate: editedData.coveragestartdate
          ? dayjs(editedData.coveragestartdate)
          : null,
        coverageenddate: editedData.coverageenddate
          ? dayjs(editedData.coverageenddate)
          : null,
      });
      setOpen(true);
    }
  };

  const handleAddNewClick = () => {
    setFormData(defaultRowData);
    setOpen(true);
    setPersonid("");
    setDateValues({
      coveragestartdate: null,
      coverageenddate: null,
    });
  };

  const handleDeleteClick = (objectId) => {
    const apiUrl = `${apiURL}/HealthInsurance/${objectId}`;
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
    const numericFields = [
      "monthlypremium",
      "deductible",
      "copay",
      "coinsurance",
    ];

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
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
    } else {
      setFormErrors({});

      try {
        const apiUrl = `${apiURL}/HealthInsurance`;
        if (editData && editData.healthinsuranceid) {
          const postData = {
            ...formData,
            ...formattedDateValues,
            nomineeid: personid,
          };
          postData.healthinsuranceid = editData.healthinsuranceid;
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
            nomineeid: personid,
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
      {!personHealthInsurance ? (
        <CircularProgress />
      ) : (
        <Box>
          <Box>
            <CommonCards
              data={rowData}
              hiddenKeys={hiddenKeys}
              Name="Healthinsurance Details"
              handleEditClick={handleEditClick}
              handleDeleteClick={handleDeleteClick}
              idKeyName="healthinsuranceid"
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
              Add New Healthinsurance
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
                  <HeadingText headtext="Healthinsurance Details" />
                  <Grid
                    container
                    rowSpacing={1}
                    columnSpacing={{ xs: 1, sm: 2, md: 3 }}
                    className="form-box"
                  >
                    <Grid item xs={6}>
                      <InputLabel>Insurance Provider</InputLabel>
                      <TextField
                        label=""
                        variant="standard"
                        name="insuranceprovider"
                        value={formData.insuranceprovider}
                        onChange={handleInputChange}
                        fullWidth
                        error={!!formErrors.insuranceprovider}
                        helperText={formErrors.insuranceprovider || ""}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <InputLabel>Policy Number</InputLabel>
                      <TextField
                        label=""
                        variant="standard"
                        name="policynumber"
                        value={formData.policynumber}
                        onChange={handleInputChange}
                        fullWidth
                        error={!!formErrors.policynumber}
                        helperText={formErrors.policynumber || ""}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <InputLabel>Group Number</InputLabel>
                      <TextField
                        label=""
                        variant="standard"
                        name="groupnumber"
                        value={formData.groupnumber}
                        onChange={handleInputChange}
                        fullWidth
                        error={!!formErrors.groupnumber}
                        helperText={formErrors.groupnumber || ""}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <InputLabel>Plan Type</InputLabel>
                      <TextField
                        label=""
                        variant="standard"
                        name="plantype"
                        value={formData.plantype}
                        onChange={handleInputChange}
                        fullWidth
                        error={!!formErrors.plantype}
                        helperText={formErrors.plantype || ""}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <InputLabel>Primary Care Physician</InputLabel>
                      <TextField
                        label=""
                        variant="standard"
                        name="primarycarephysician"
                        value={formData.primarycarephysician}
                        onChange={handleInputChange}
                        fullWidth
                        error={!!formErrors.primarycarephysician}
                        helperText={formErrors.primarycarephysician || ""}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <InputLabel>Specialist</InputLabel>
                      <TextField
                        label=""
                        variant="standard"
                        name="specialist"
                        value={formData.specialist}
                        onChange={handleInputChange}
                        fullWidth
                        error={!!formErrors.specialist}
                        helperText={formErrors.specialist || ""}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <InputLabel>Monthly Premium</InputLabel>
                      <TextField
                        label=""
                        variant="standard"
                        name="monthlypremium"
                        value={formData.monthlypremium}
                        onChange={handleInputChange}
                        fullWidth
                        type="number"
                        error={!!formErrors.monthlypremium}
                        helperText={formErrors.monthlypremium || ""}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <InputLabel>Deductible</InputLabel>
                      <TextField
                        label=""
                        variant="standard"
                        name="deductible"
                        value={formData.deductible}
                        onChange={handleInputChange}
                        fullWidth
                        type="number"
                        error={!!formErrors.deductible}
                        helperText={formErrors.deductible || ""}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <InputLabel>Copay</InputLabel>
                      <TextField
                        label=""
                        variant="standard"
                        name="copay"
                        type="number"
                        value={formData.copay}
                        onChange={handleInputChange}
                        fullWidth
                        error={!!formErrors.copay}
                        helperText={formErrors.copay || ""}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <InputLabel>Coinsurance</InputLabel>
                      <TextField
                        label=""
                        variant="standard"
                        name="coinsurance"
                        type="number"
                        value={formData.coinsurance}
                        onChange={handleInputChange}
                        fullWidth
                        error={!!formErrors.coinsurance}
                        helperText={formErrors.coinsurance || ""}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <InputLabel>Coverage Start Date</InputLabel>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <Stack>
                          <DatePicker
                            value={dateValues.coveragestartdate}
                            onChange={(newValue) =>
                              handleDateChange("coveragestartdate", newValue)
                            }
                            referenceDate={dayjs("2022-04-17")}
                            format="YYYY-MM-DD"
                             slotProps={{ textField: { size: "small", variant: "standard" }, }}
                            className="DateInput"
                          />
                        </Stack>
                      </LocalizationProvider>
                      {formErrors.coveragestartdate && (
                        <Typography variant="body2" color="error">
                          {formErrors.coveragestartdate}
                        </Typography>
                      )}
                    </Grid>
                    <Grid item xs={6}>
                      <InputLabel>Cover Ageend Date</InputLabel>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <Stack>
                          <DatePicker
                            value={dateValues.coverageenddate}
                            onChange={(newValue) =>
                              handleDateChange("coverageenddate", newValue)
                            }
                            referenceDate={dayjs("2022-04-17")}
                            format="YYYY-MM-DD"
                             slotProps={{ textField: { size: "small", variant: "standard" }, }}
                            className="DateInput"
                          />
                        </Stack>
                      </LocalizationProvider>
                      {formErrors.coverageenddate && (
                        <Typography variant="body2" color="error">
                          {formErrors.coverageenddate}
                        </Typography>
                      )}
                    </Grid>
                    <Grid item xs={6}>
                      <InputLabel>Nominee</InputLabel>
                      <TextField
                        onClick={handleSelectClick}
                        fullWidth
                        variant="standard"
                        size="small"
                        error={!!formErrors.personid}
                        helperText={formErrors.personid || ""}
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

export default PersonHealthInsurance;
