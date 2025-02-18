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
  Confirmation,
  country,
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

const PersonAddress = ({ personID }) => {
  const { personAddress } = useContext(ApiContext);
  const isPersonIDValid = personID != null && personID !== "";
  const rowData =
    personAddress && isPersonIDValid
      ? personAddress.filter((person) => person.personid == personID)
      : [];

  // console.log(rowData);

  const defaultRowData = {
    street: "",
    country: "",
    city: "",
    state: "",
    postalcode: "",
    county: "",
    addresstype: "",
    isprimaryaddress: "",
    addresslabel: "",
    residentialtype: "",
    buildingname: "",
    floornumber: null,
    unitnumber: "",
    landmark: "",
    pobox: "",
    isactiveaddress: "",
    addressnotes: "",
    latitude: null,
    longitude: null,
  };

  const initialFormData =
    rowData.length > 0 ? { ...defaultRowData, ...rowData[0] } : defaultRowData;

  const initialDateValues = {
    addressstartdate: initialFormData.addressstartdate
      ? dayjs(initialFormData.addressstartdate)
      : null,
    addressenddate: initialFormData.addressenddate
      ? dayjs(initialFormData.addressenddate)
      : null,
  };

  const hiddenKeys = ["id", "personid", "person", "addressid"];
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [formErrors, setFormErrors] = useState({});
  const apiURL = process.env.REACT_APP_BASE_URL;
  const [dateValues, setDateValues] = useState(initialDateValues);
  const [editData, setEditData] = useState({});

  const handleEditClick = (objectId) => {
    const editedData = rowData.find((person) => person.addressid === objectId);
    setEditData(editedData);
    if (editedData) {
      setFormData({ ...defaultRowData, ...editedData });
      setDateValues({
        addressstartdate: editedData.addressstartdate
          ? dayjs(editedData.addressstartdate)
          : null,
        addressenddate: editedData.addressenddate
          ? dayjs(editedData.addressenddate)
          : null,
      });
      setOpen(true);
    }
  };

  const handleAddNewClick = () => {
    setFormData(defaultRowData);
    setOpen(true);
    setDateValues({
      addressstartdate: null,
      addressenddate: null,
    });
  };

  const handleDeleteClick = (objectId) => {
    const apiUrl = `${apiURL}/address/${objectId}`;
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
        const apiUrl = `${apiURL}/address`;
        if (editData && editData.addressid) {
          const postData = {
            ...formData,
            ...formattedDateValues,
          };
          postData.addressid = editData.addressid;
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
      {!personAddress ? (
        <CircularProgress />
      ) : (
        <Box>
          <Box>
            <CommonCards
              data={rowData}
              hiddenKeys={hiddenKeys}
              Name="Address Details"
              handleEditClick={handleEditClick}
              handleDeleteClick={handleDeleteClick}
              idKeyName="addressid"
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
              Add New Address
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
              <HeadingText headtext="Address Details" />
              <Grid
                container
                rowSpacing={1}
                columnSpacing={{ xs: 1, sm: 2, md: 3 }}
                className="form-box"
              >
                <Grid item xs={6}>
                  <InputLabel>Street</InputLabel>
                  <TextField
                    label=""
                    variant="standard"
                    name="street"
                    value={formData.street}
                    onChange={handleInputChange}
                    fullWidth
                    error={!!formErrors.street}
                    helperText={formErrors.street || ""}
                  />
                </Grid>
                <Grid item xs={6}>
                  <InputLabel>Country</InputLabel>
                  <FormControl fullWidth>
                    <Select
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      variant="standard"
                      label=""
                      error={!!formErrors.country}
                      helperText={formErrors.country || ""}
                    >
                      {country.map((countryOption) => (
                        <MenuItem key={countryOption} value={countryOption}>
                          {countryOption}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={6}>
                  <InputLabel>City</InputLabel>
                  <TextField
                    label=""
                    variant="standard"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    fullWidth
                    error={!!formErrors.city}
                    helperText={formErrors.city || ""}
                  />
                </Grid>
                <Grid item xs={6}>
                  <InputLabel>state</InputLabel>
                  <TextField
                    label=""
                    variant="standard"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    fullWidth
                    error={!!formErrors.state}
                    helperText={formErrors.state || ""}
                  />
                </Grid>
                <Grid item xs={6}>
                  <InputLabel>Postal Code</InputLabel>
                  <TextField
                    label=""
                    variant="standard"
                    name="postalcode"
                    value={formData.postalcode}
                    onChange={handleInputChange}
                    fullWidth
                    type="number"
                    error={!!formErrors.postalcode}
                    helperText={formErrors.postalcode || ""}
                  />
                </Grid>
                <Grid item xs={6}>
                  <InputLabel>Primary Address</InputLabel>
                  <FormControl fullWidth>
                    <Select
                      name="isprimaryaddress"
                      value={formData.isprimaryaddress}
                      onChange={handleInputChange}
                      variant="standard"
                      label=""
                      error={!!formErrors.isprimaryaddress}
                      helperText={formErrors.isprimaryaddress || ""}
                    >
                      {Confirmation.map((isprimaryaddressOption) => (
                        <MenuItem
                          key={isprimaryaddressOption}
                          value={isprimaryaddressOption}
                        >
                          {isprimaryaddressOption}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={6}>
                  <InputLabel>County</InputLabel>
                  <TextField
                    label=""
                    variant="standard"
                    name="county"
                    value={formData.county}
                    onChange={handleInputChange}
                    fullWidth
                    error={!!formErrors.county}
                    helperText={formErrors.county || ""}
                  />
                </Grid>
                <Grid item xs={6}>
                  <InputLabel>Address Type</InputLabel>
                  <FormControl fullWidth>
                    <Select
                      name="addresstype"
                      value={formData.addresstype}
                      onChange={handleInputChange}
                      variant="standard"
                      label=""
                      error={!!formErrors.addresstype}
                      helperText={formErrors.addresstype || ""}
                    >
                      {addresstype.map((addresstypeOption) => (
                        <MenuItem
                          key={addresstypeOption}
                          value={addresstypeOption}
                        >
                          {addresstypeOption}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={6}>
                  <InputLabel>Address Label</InputLabel>
                  <TextField
                    label=""
                    variant="standard"
                    name="addresslabel"
                    value={formData.addresslabel}
                    onChange={handleInputChange}
                    fullWidth
                    error={!!formErrors.addresslabel}
                    helperText={formErrors.addresslabel || ""}
                  />
                </Grid>
                <Grid item xs={6}>
                  <InputLabel>Residential Type</InputLabel>
                  <FormControl fullWidth>
                    <Select
                      name="residentialtype"
                      value={formData.residentialtype}
                      onChange={handleInputChange}
                      variant="standard"
                      label=""
                      error={!!formErrors.residentialtype}
                      helperText={formErrors.residentialtype || ""}
                    >
                      {residentialtype.map((residentialtypeOption) => (
                        <MenuItem
                          key={residentialtypeOption}
                          value={residentialtypeOption}
                        >
                          {residentialtypeOption}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={6}>
                  <InputLabel>Building Name</InputLabel>
                  <TextField
                    label=""
                    variant="standard"
                    name="buildingname"
                    value={formData.buildingname}
                    onChange={handleInputChange}
                    fullWidth
                    error={!!formErrors.buildingname}
                    helperText={formErrors.buildingname || ""}
                  />
                </Grid>
                <Grid item xs={6}>
                  <InputLabel>floornumber</InputLabel>
                  <TextField
                    label=""
                    variant="standard"
                    name="floornumber"
                    value={formData.floornumber}
                    onChange={handleInputChange}
                    fullWidth
                    type="number"
                    error={!!formErrors.floornumber}
                    helperText={formErrors.floornumber || ""}
                  />
                </Grid>
                <Grid item xs={6}>
                  <InputLabel>Unitnumber</InputLabel>
                  <TextField
                    label=""
                    variant="standard"
                    name="unitnumber"
                    value={formData.unitnumber}
                    onChange={handleInputChange}
                    fullWidth
                    error={!!formErrors.unitnumber}
                    helperText={formErrors.unitnumber || ""}
                  />
                </Grid>
                <Grid item xs={6}>
                  <InputLabel>P.O Box</InputLabel>
                  <TextField
                    label=""
                    variant="standard"
                    name="pobox"
                    value={formData.pobox}
                    onChange={handleInputChange}
                    fullWidth
                    error={!!formErrors.pobox}
                    helperText={formErrors.pobox || ""}
                  />
                </Grid>
                <Grid item xs={6}>
                  <InputLabel>Landmark</InputLabel>
                  <TextField
                    label=""
                    variant="standard"
                    name="landmark"
                    value={formData.landmark}
                    onChange={handleInputChange}
                    fullWidth
                    error={!!formErrors.landmark}
                    helperText={formErrors.landmark || ""}
                  />
                </Grid>
                <Grid item xs={6}>
                  <InputLabel>Addressnotes</InputLabel>
                  <TextField
                    label=""
                    variant="standard"
                    name="addressnotes"
                    value={formData.addressnotes}
                    onChange={handleInputChange}
                    fullWidth
                    error={!!formErrors.addressnotes}
                    helperText={formErrors.addressnotes || ""}
                  />
                </Grid>
                <Grid item xs={6}>
                  <InputLabel>Active Address</InputLabel>
                  <FormControl fullWidth>
                    <Select
                      name="isactiveaddress"
                      value={formData.isactiveaddress}
                      onChange={handleInputChange}
                      variant="standard"
                      label=""
                      error={!!formErrors.isactiveaddress}
                      helperText={formErrors.isactiveaddress || ""}
                    >
                      {Confirmation.map((isactiveaddressOption) => (
                        <MenuItem
                          key={isactiveaddressOption}
                          value={isactiveaddressOption}
                        >
                          {isactiveaddressOption}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={6}>
                  <InputLabel>Latitude</InputLabel>
                  <TextField
                    label=""
                    variant="standard"
                    name="latitude"
                    value={formData.latitude}
                    onChange={handleInputChange}
                    fullWidth
                    type="number"
                    error={!!formErrors.latitude}
                    helperText={formErrors.latitude || ""}
                  />
                </Grid>
                <Grid item xs={6}>
                  <InputLabel>Longitude</InputLabel>
                  <TextField
                    label=""
                    variant="standard"
                    name="longitude"
                    value={formData.longitude}
                    onChange={handleInputChange}
                    fullWidth
                    type="number"
                    error={!!formErrors.longitude}
                    helperText={formErrors.longitude || ""}
                  />
                </Grid>
                <Grid item xs={6}>
                  <InputLabel>Address Start Date</InputLabel>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <Stack>
                      <DatePicker
                        value={dateValues.addressstartdate}
                        onChange={(newValue) =>
                          handleDateChange("addressstartdate", newValue)
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
                  {formErrors.addressstartdate && (
                    <Typography variant="body2" color="error">
                      {formErrors.addressstartdate}
                    </Typography>
                  )}
                </Grid>
                <Grid item xs={6}>
                  <InputLabel>Address End Date</InputLabel>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <Stack>
                      <DatePicker
                        value={dateValues.addressenddate}
                        onChange={(newValue) =>
                          handleDateChange("addressenddate", newValue)
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
                  {formErrors.addressenddate && (
                    <Typography variant="body2" color="error">
                      {formErrors.addressenddate}
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

export default PersonAddress;
