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
} from "@mui/material";
import CommonCards from "../../../../Components/CommonCards/CommonCards";
import AddIcon from "@mui/icons-material/Add";
import CommonButton from "../../../../Components/CommonButton/CommonButton";
import CommonModal from "../../../../Components/CommonModal/CommonModal";
import HeadingText from "../../../../Components/CommonHeading/HeadingText";
import ApiService from "../../../../Service/ApiService";
import { validatePersonContact } from "../../../../Validation/Validation";
import { Confirmation } from "../../../../DummyObject/ObjectVal";

const PersonSchool = ({ personID }) => {
  const { personSchool } = useContext(ApiContext);
  const rowData = personID
    ? personSchool.filter((item) => item.schoolid === personID)
    : personSchool;

  const defaultRowData = {
    schoolname: "",
    schoollocation: "",
    accreditationstatus: "",
    contactemail: "",
    contactphone: "",
    websiteurl: "",
    foundationyear: "",
  };

  const initialFormData =
    rowData.length > 0 ? { ...defaultRowData, ...rowData[0] } : defaultRowData;

  const hiddenKeys = [];
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [formErrors, setFormErrors] = useState({});
  const apiURL = process.env.REACT_APP_BASE_URL;
  const [editData, setEditData] = useState({});

  const handleEditClick = (objectId) => {
    const editedData = rowData.find((person) => person.schoolid === objectId);
    setEditData(editedData);
    if (editedData) {
      setFormData({ ...defaultRowData, ...editedData });
      setOpen(true);
    }
  };

  const handleAddNewClick = () => {
    setFormData(defaultRowData);
    setOpen(true);
  };

  const handleDeleteClick = (objectId) => {
    const apiUrl = `${apiURL}/school/${objectId}`;
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

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const errors = validatePersonContact(formData);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
    } else {
      setFormErrors({});

      try {
        const apiUrl = `${apiURL}/school`;
        const postData = {
          ...formData,
        };

        if (editData && editData.schoolid) {
          console.log(postData);
          postData.schoolid = editData.schoolid;
          console.log(postData);
          const responseData = await ApiService.request(
            "PUT",
            apiUrl,
            postData
          );
          console.log("person api Response (PUT):", responseData);
          alert("Data Updated Successfully!");
        } else {
          console.log(postData);
          const responseData = await ApiService.request(
            "POST",
            apiUrl,
            postData
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
      {!personSchool ? (
        <CircularProgress />
      ) : (
        <Box>
          <Box>
            <CommonCards
              data={rowData}
              hiddenKeys={hiddenKeys}
              Name="School Details"
              handleEditClick={handleEditClick}
              handleDeleteClick={handleDeleteClick}
              idKeyName="schoolid"
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
              Add New School
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
              <HeadingText headtext="School Details" />
              <Grid
                container
                rowSpacing={1}
                columnSpacing={{ xs: 1, sm: 2, md: 3 }}
                className="form-box"
              >
                <Grid item xs={6}>
                  <InputLabel>School Name</InputLabel>
                  <TextField
                    label=""
                    variant="standard"
                    name="schoolname"
                    value={formData.schoolname}
                    onChange={handleInputChange}
                    fullWidth
                    error={!!formErrors.schoolname}
                    helperText={formErrors.schoolname || ""}
                  />
                </Grid>
                <Grid item xs={6}>
                  <InputLabel>School Location</InputLabel>
                  <TextField
                    label=""
                    variant="standard"
                    name="schoollocation"
                    value={formData.schoollocation}
                    onChange={handleInputChange}
                    fullWidth
                    error={!!formErrors.schoollocation}
                    helperText={formErrors.schoollocation || ""}
                  />
                </Grid>
                <Grid item xs={6}>
                  <InputLabel>Contact Email</InputLabel>
                  <TextField
                    label=""
                    variant="standard"
                    name="contactemail"
                    value={formData.contactemail}
                    onChange={handleInputChange}
                    fullWidth
                    error={!!formErrors.contactemail}
                    helperText={formErrors.contactemail || ""}
                  />
                </Grid>
                <Grid item xs={6}>
                  <InputLabel>Contact Phone</InputLabel>
                  <TextField
                    label=""
                    variant="standard"
                    name="contactphone"
                    value={formData.contactphone}
                    onChange={handleInputChange}
                    fullWidth
                    error={!!formErrors.contactphone}
                    helperText={formErrors.contactphone || ""}
                  />
                </Grid>
                <Grid item xs={6}>
                  <InputLabel>website Url</InputLabel>
                  <TextField
                    label=""
                    variant="standard"
                    name="websiteurl"
                    value={formData.websiteurl}
                    onChange={handleInputChange}
                    fullWidth
                    error={!!formErrors.websiteurl}
                    helperText={formErrors.websiteurl || ""}
                  />
                </Grid>
                <Grid item xs={6}>
                  <InputLabel>Foundation Year</InputLabel>
                  <TextField
                    label=""
                    variant="standard"
                    name="foundationyear"
                    value={formData.foundationyear}
                    onChange={handleInputChange}
                    fullWidth
                    error={!!formErrors.foundationyear}
                    helperText={formErrors.foundationyear || ""}
                    type="number"
                  />
                </Grid>
                <Grid item xs={6}>
                  <InputLabel>Accreditation Status</InputLabel>
                  <FormControl fullWidth variant="standard" size="small">
                    <Select
                      name="accreditationstatus"
                      value={formData.accreditationstatus}
                      onChange={handleInputChange}
                      label=""
                      error={!!formErrors.accreditationstatus}
                      helperText={formErrors.accreditationstatus || ""}
                    >
                      {Confirmation.map((accreditationstatusOption) => (
                        <MenuItem
                          key={accreditationstatusOption}
                          value={accreditationstatusOption}
                        >
                          {accreditationstatusOption}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
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

export default PersonSchool;
