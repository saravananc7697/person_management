import React, { useContext, useState } from "react";
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
  FormControl,
  Select,
  MenuItem,
} from "@mui/material";
import CommonCards from "../../../../Components/CommonCards/CommonCards";
import AddIcon from "@mui/icons-material/Add";
import CommonButton from "../../../../Components/CommonButton/CommonButton";
import CommonModal from "../../../../Components/CommonModal/CommonModal";
import HeadingText from "../../../../Components/CommonHeading/HeadingText";
import ApiService from "../../../../Service/ApiService";
import { validatePersonContact } from "../../../../Validation/Validation";

const PersonTribe = ({ personID }) => {
  const { personTribe } = useContext(ApiContext);
  const rowData = personID
    ? personTribe.filter((item) => item.tribeid === personID)
    : personTribe;

  const defaultRowData = {
    tribename: "",
    tribelanguage: "",
    triberegion: "",
    oldtribename: "",
    tribedescription: "",
  };

  const initialFormData =
    rowData.length > 0 ? { ...defaultRowData, ...rowData[0] } : defaultRowData;

  const hiddenKeys = ["id", "personid", "person", "tribeaffiliations", "tribe"];
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [formErrors, setFormErrors] = useState({});
  const apiURL = process.env.REACT_APP_BASE_URL;
  const [editData, setEditData] = useState({});

  const handleEditClick = (objectId) => {
    const editedData = rowData.find((person) => person.tribeid === objectId);
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
    const apiUrl = `${apiURL}/tribe/${objectId}`;
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
        const apiUrl = `${apiURL}/tribe`;
        if (editData && editData.tribeid) {
          const postData = {
            ...formData,
          };
          postData.tribeid = editData.tribeid;
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
      {!personTribe ? (
        <CircularProgress />
      ) : (
        <Box>
          <Box>
            <CommonCards
              data={rowData}
              hiddenKeys={hiddenKeys}
              Name="Tribe Details"
              handleEditClick={handleEditClick}
              handleDeleteClick={handleDeleteClick}
              idKeyName="tribeid"
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
              Add New Tribe
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
              <HeadingText headtext="Tribe Details" />
              <Grid
                container
                rowSpacing={1}
                columnSpacing={{ xs: 1, sm: 2, md: 3 }}
                className="form-box"
              >
                <Grid item xs={6}>
                  <InputLabel>Tribe Name</InputLabel>
                  <TextField
                    label=""
                    variant="standard"
                    size="small"
                    name="tribename"
                    value={formData.tribename}
                    onChange={handleInputChange}
                    fullWidth
                    error={!!formErrors.tribename}
                    helperText={formErrors.tribename || ""}
                  />
                </Grid>
                <Grid item xs={6}>
                  <InputLabel>Tribe Language</InputLabel>
                  <TextField
                    label=""
                    variant="standard"
                    size="small"
                    name="tribelanguage"
                    value={formData.tribelanguage}
                    onChange={handleInputChange}
                    fullWidth
                    error={!!formErrors.tribelanguage}
                    helperText={formErrors.tribelanguage || ""}
                  />
                </Grid>
                <Grid item xs={6}>
                  <InputLabel>Tribe Region</InputLabel>
                  <TextField
                    label=""
                    variant="standard"
                    size="small"
                    name="triberegion"
                    value={formData.triberegion}
                    onChange={handleInputChange}
                    fullWidth
                    error={!!formErrors.triberegion}
                    helperText={formErrors.triberegion || ""}
                  />
                </Grid>
                <Grid item xs={6}>
                  <InputLabel>Old Tribe Name</InputLabel>
                  <TextField
                    label=""
                    variant="standard"
                    size="small"
                    name="oldtribename"
                    value={formData.oldtribename}
                    onChange={handleInputChange}
                    fullWidth
                    error={!!formErrors.oldtribename}
                    helperText={formErrors.oldtribename || ""}
                  />
                </Grid>
                <Grid item xs={6}>
                  <InputLabel>Tribe Description</InputLabel>
                  <TextField
                    label=""
                    variant="standard"
                    size="small"
                    name="tribedescription"
                    value={formData.tribedescription}
                    onChange={handleInputChange}
                    fullWidth
                    error={!!formErrors.tribedescription}
                    helperText={formErrors.tribedescription || ""}
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

export default PersonTribe;
