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
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import TribeSearchingBox from "../../../../../Components/CommonSearchingBox/TribeSearchingBox";

const PersonTribeAffiliation = ({ personID }) => {
  const { personTribeAffiliation } = useContext(ApiContext);
  const isPersonIDValid = personID != null && personID !== "";
  const rowData =
    personTribeAffiliation && isPersonIDValid
      ? personTribeAffiliation.filter((person) => person.personid == personID)
      : [];

  // console.log(rowData);

  const defaultRowData = {
    tribeverificationtype: "",
    tribeid: null,
  };

  const initialFormData =
    rowData.length > 0 ? { ...defaultRowData, ...rowData[0] } : defaultRowData;

  const initialDateValues = {
    tribeverificationdate: initialFormData.tribeverificationdate
      ? dayjs(initialFormData.tribeverificationdate)
      : null,
  };

  const hiddenKeys = [
    "id",
    "personid",
    "person",
    "tribeaffiliationid",
    "tribe",
  ];
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [formErrors, setFormErrors] = useState({});
  const apiURL = process.env.REACT_APP_BASE_URL;
  const [dateValues, setDateValues] = useState(initialDateValues);
  const [editData, setEditData] = useState({});
  const [open1, setOpen1] = useState(false);
  const [tribeid, setTribeid] = useState("");

  const handleTribeChange = (value) => {
    setTribeid(value);
    setOpen1(false);
  };

  const handleEditClick = (objectId) => {
    const editedData = rowData.find(
      (person) => person.tribeaffiliationid === objectId
    );
    setEditData(editedData);
    if (editedData) {
      setFormData({ ...defaultRowData, ...editedData });
      setTribeid(editedData.tribeid);
      setDateValues({
        tribeverificationdate: editedData.tribeverificationdate
          ? dayjs(editedData.tribeverificationdate)
          : null,
      });
      setOpen(true);
    }
  };

  const handleAddNewClick = () => {
    setFormData(defaultRowData);
    setOpen(true);
    setTribeid("");
    setDateValues({
      tribeverificationdate: null,
    });
  };

  const handleDeleteClick = (objectId) => {
    const apiUrl = `${apiURL}/tribeAffiliation/${objectId}`;
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
    if (!tribeid) {
      errors.tribeid = "Person is required";
    }
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
    } else {
      setFormErrors({});

      try {
        const apiUrl = `${apiURL}/tribeAffiliation`;
        if (editData && editData.tribeaffiliationid) {
          const postData = {
            ...formData,
            ...formattedDateValues,
            tribeid: tribeid,
          };
          postData.tribeaffiliationid = editData.tribeaffiliationid;
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
            tribeid: tribeid,
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
      {!personTribeAffiliation ? (
        <CircularProgress />
      ) : (
        <Box>
          <Box>
            <CommonCards
              data={rowData}
              hiddenKeys={hiddenKeys}
              Name="Tribe Affiliation Details"
              handleEditClick={handleEditClick}
              handleDeleteClick={handleDeleteClick}
              idKeyName="tribeaffiliationid"
              keyNameToAlert="tribeid"
              pageName="Tribe"
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
              Add New Tribe Affiliation
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
            <TribeSearchingBox handleTribeChange={handleTribeChange} />
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
                  <HeadingText headtext="Tribe Affiliation Details" />
                  <Grid
                    container
                    rowSpacing={1}
                    columnSpacing={{ xs: 1, sm: 2, md: 3 }}
                    className="form-box"
                  >
                    <Grid item xs={6}>
                      <InputLabel>Tribe</InputLabel>
                      <TextField
                        onClick={handleSelectClick}
                        fullWidth
                        variant="standard"
                        size="small"
                        error={!!formErrors.tribeid}
                        helperText={formErrors.tribeid || ""}
                        value={tribeid} // Set the intakeId value here
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
                      <InputLabel>Tribe Verification Type</InputLabel>
                      <TextField
                        label=""
                        variant="standard"
                        name="tribeverificationtype"
                        value={formData.tribeverificationtype}
                        onChange={handleInputChange}
                        fullWidth
                        error={!!formErrors.tribeverificationtype}
                        helperText={formErrors.tribeverificationtype || ""}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <InputLabel>Tribe Verification Date</InputLabel>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <Stack>
                          <DatePicker
                            value={dateValues.tribeverificationdate}
                            onChange={(newValue) =>
                              handleDateChange(
                                "tribeverificationdate",
                                newValue
                              )
                            }
                            referenceDate={dayjs("2022-04-17")}
                            format="YYYY-MM-DD"
                             slotProps={{ textField: { size: "small", variant: "standard" }, }}
                            className="DateInput"
                          />
                        </Stack>
                      </LocalizationProvider>
                      {formErrors.tribeverificationdate && (
                        <Typography variant="body2" color="error">
                          {formErrors.tribeverificationdate}
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
      )}
    </div>
  );
};

export default PersonTribeAffiliation;
