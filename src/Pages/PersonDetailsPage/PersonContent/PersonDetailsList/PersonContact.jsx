import React, { useContext, useState } from "react";
import { ApiContext } from "../../../../Context-data/ApiContext";
import CircularProgress from "@mui/material/CircularProgress";
import {
  Box,
  InputLabel,
  TextField,
  Typography,
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
import { type, Confirmation } from "../../../../DummyObject/ObjectVal";
import HeadingText from "../../../../Components/CommonHeading/HeadingText";
import ApiService from "../../../../Service/ApiService";
import { validatePersonContact } from "../../../../Validation/Validation";

const PersonContact = ({ personID }) => {
  const { personContact } = useContext(ApiContext);
  const isPersonIDValid = personID != null && personID !== "";
  const rowData =
    personContact && isPersonIDValid
      ? personContact.filter((person) => person.personid == personID)
      : [];

  const defaultRowData = {
    phonetype: "",
    phonenumber: "",
    isprimaryphone: "",
    countrycode: "",
    extension: null,
    emailid: "",
    emailtype: "",
    isprimaryemail: "",
    isactivephone: "",
    isactiveemail: "",
  };

  const initialFormData =
    rowData.length > 0 ? { ...defaultRowData, ...rowData[0] } : defaultRowData;

  const hiddenKeys = ["id", "personid", "person"];
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [formErrors, setFormErrors] = useState({});
  const [editData, setEditData] = useState({});
  const apiURL = process.env.REACT_APP_BASE_URL;

  const handleEditClick = (objectId) => {
    const editedData = rowData.find((person) => person.id === objectId);
    setEditData(editedData);
    if (editedData) {
      setFormData({ ...defaultRowData, ...editedData });
      setOpen(true);
    }
  };

  const handleAddNewClick = () => {
    console.log(defaultRowData);
    setFormData(defaultRowData);
    setOpen(true);
  };

  const handleDeleteClick = (objectId) => {
    const apiUrl = `${apiURL}/phoneEmail/${objectId}`;
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
    const numericFields = ["extension"];

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
        const apiUrl = `${apiURL}/phoneEmail`;
        if (editData && editData.id) {
          const postData = {
            ...formData,
          };
          postData.id = editData.id;
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
            personid: personID,
          };

          const responseData = await ApiService.request(
            "POST",
            apiUrl,
            postData2
          );
          console.log("person api Response (POST):", responseData);
          alert("person Created Successfully!");
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
      {!personContact ? (
        <CircularProgress />
      ) : (
        <Box>
          <Box>
            <CommonCards
              data={rowData}
              hiddenKeys={hiddenKeys}
              Name="Contact Details"
              handleEditClick={handleEditClick}
              handleDeleteClick={handleDeleteClick}
              idKeyName="id"
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
              Add New Contact Details
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
              <HeadingText headtext="Contact Details" />
              <Grid
                container
                rowSpacing={1}
                columnSpacing={{ xs: 1, sm: 2, md: 3 }}
                className="form-box"
              >
                <Grid item xs={6}>
                  <InputLabel>Phone Type</InputLabel>
                  <FormControl fullWidth>
                    <Select
                      name="phonetype"
                      value={formData.phonetype}
                      onChange={handleInputChange}
                      variant="standard"
                      label=""
                      error={!!formErrors.phonetype}
                      helperText={formErrors.phonetype || ""}
                    >
                      {type.map((phonetypeOption) => (
                        <MenuItem key={phonetypeOption} value={phonetypeOption}>
                          {phonetypeOption}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={6}>
                  <InputLabel>Active Phone</InputLabel>
                  <FormControl fullWidth>
                    <Select
                      name="isactivephone"
                      value={formData.isactivephone}
                      onChange={handleInputChange}
                      variant="standard"
                      label=""
                      error={!!formErrors.isactivephone}
                      helperText={formErrors.isactivephone || ""}
                    >
                      {Confirmation.map((isactivephoneOption) => (
                        <MenuItem
                          key={isactivephoneOption}
                          value={isactivephoneOption}
                        >
                          {isactivephoneOption}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={6}>
                  <InputLabel>Primary Phone</InputLabel>
                  <FormControl fullWidth>
                    <Select
                      name="isprimaryphone"
                      value={formData.isprimaryphone}
                      onChange={handleInputChange}
                      variant="standard"
                      label=""
                      error={!!formErrors.isprimaryphone}
                      helperText={formErrors.isprimaryphone || ""}
                    >
                      {Confirmation.map((isprimaryphoneOption) => (
                        <MenuItem
                          key={isprimaryphoneOption}
                          value={isprimaryphoneOption}
                        >
                          {isprimaryphoneOption}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={6}>
                  <InputLabel>Country Code</InputLabel>
                  <TextField
                    label=""
                    variant="standard"
                    name="countrycode"
                    value={formData.countrycode}
                    onChange={handleInputChange}
                    fullWidth
                    error={!!formErrors.countrycode}
                    helperText={formErrors.countrycode || ""}
                  />
                </Grid>
                <Grid item xs={6}>
                  <InputLabel>Phone Number</InputLabel>
                  <TextField
                    label=""
                    variant="standard"
                    name="phonenumber"
                    value={formData.phonenumber}
                    onChange={handleInputChange}
                    fullWidth
                    error={!!formErrors.phonenumber}
                    helperText={formErrors.phonenumber || ""}
                  />
                </Grid>
                <Grid item xs={6}>
                  <InputLabel>Extension</InputLabel>
                  <TextField
                    label=""
                    variant="standard"
                    name="extension"
                    value={formData.extension}
                    onChange={handleInputChange}
                    fullWidth
                    type="number"
                    error={!!formErrors.extension}
                    helperText={formErrors.extension || ""}
                  />
                </Grid>
                <Grid item xs={6}>
                  <InputLabel>Email Type</InputLabel>
                  <FormControl fullWidth>
                    <Select
                      name="emailtype"
                      value={formData.emailtype}
                      onChange={handleInputChange}
                      variant="standard"
                      label=""
                      error={!!formErrors.emailtype}
                      helperText={formErrors.emailtype || ""}
                    >
                      {type.map((emailtypeOption) => (
                        <MenuItem key={emailtypeOption} value={emailtypeOption}>
                          {emailtypeOption}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={6}>
                  <InputLabel>Primary Email</InputLabel>
                  <FormControl fullWidth>
                    <Select
                      name="isprimaryemail"
                      value={formData.isprimaryemail}
                      onChange={handleInputChange}
                      variant="standard"
                      label=""
                      error={!!formErrors.isprimaryemail}
                      helperText={formErrors.isprimaryemail || ""}
                    >
                      {Confirmation.map((isprimaryemailOption) => (
                        <MenuItem
                          key={isprimaryemailOption}
                          value={isprimaryemailOption}
                        >
                          {isprimaryemailOption}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={6}>
                  <InputLabel>Active Email</InputLabel>
                  <FormControl fullWidth>
                    <Select
                      name="isactiveemail"
                      value={formData.isactiveemail}
                      onChange={handleInputChange}
                      variant="standard"
                      label=""
                      error={!!formErrors.isactiveemail}
                      helperText={formErrors.isactiveemail || ""}
                    >
                      {Confirmation.map((isactiveemailOption) => (
                        <MenuItem
                          key={isactiveemailOption}
                          value={isactiveemailOption}
                        >
                          {isactiveemailOption}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={6}>
                  <InputLabel>Email Id</InputLabel>
                  <TextField
                    label=""
                    variant="standard"
                    name="emailid"
                    value={formData.emailid}
                    onChange={handleInputChange}
                    fullWidth
                    error={!!formErrors.emailid}
                    helperText={formErrors.emailid || ""}
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

export default PersonContact;
