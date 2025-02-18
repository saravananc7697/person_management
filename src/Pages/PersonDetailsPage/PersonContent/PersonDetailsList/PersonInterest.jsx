import { React, useContext, useState } from "react";
import { ApiContext } from "../../../../Context-data/ApiContext";
import CircularProgress from "@mui/material/CircularProgress";
import {
  Box,
  InputLabel,
  TextField,
  Typography,
  IconButton,
} from "@mui/material";
import CommonLoader from "../../../../Components/CommonLoder/CommonLoader";
import CommonButton from "../../../../Components/CommonButton/CommonButton";
import ApiService from "../../../../Service/ApiService";
import EditIcon from "@mui/icons-material/Edit";

const PersonInterest = ({ personID }) => {
  const { personInterest } = useContext(ApiContext);
  const isPersonIDValid = personID != null && personID !== "";
  const rowData =
    personInterest && isPersonIDValid
      ? personInterest.find((person) => person.personid == personID)
      : null;

  // console.log(rowData);

  const defaultRowData = {
    sports: "",
    music: "",
    movies: "",
    hobbies: "",
    foodpreferences: "",
    travelpreferences: "",
    others: "",
  };

  const initialFormData = rowData
    ? { ...defaultRowData, ...rowData }
    : defaultRowData;

  const apiURL = process.env.REACT_APP_BASE_URL;
  const [formData, setFormData] = useState(initialFormData);
  const [loader, setLoader] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [isEditing, setIsEditing] = useState(false);

  const handleInputChange = (e) => {
    if (isEditing) {
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
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    // const errors = validatePersonInterest(formData);
    // if (Object.keys(errors).length > 0) {
    //   setFormErrors(errors);
    // } else {
    //   setFormErrors({});
    //   setLoader(true);

    try {
      const postData = {
        ...formData,
      };

      const apiUrl = `${apiURL}/Interest`;
      if (rowData && Object.keys(rowData).length !== 0 && rowData.id) {
        postData.id = rowData.id;

        const responseData = await ApiService.request("PUT", apiUrl, postData);
        console.log("person Interest api Response (PUT):", responseData);
        alert("Person Interest Updated Successfully!");
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
        console.log("person Interest api Response (POST):", responseData);
        alert("person Interest Created Successfully!");
      }
      window.location.reload();
    } catch (error) {
      console.error("Error occurred during POST request in Person:", error);
      setLoader(false);
      return alert("something went wrong");
    }
    // }
  };

  return (
    <div>
      {!personInterest ? (
        <CircularProgress />
      ) : (
        <Box className="commonBox">
          <form id="PersonInterest" onSubmit={handleFormSubmit}>
            <Box className="formHeading">
              <Typography>Personal Interest</Typography>
              <IconButton
                onClick={() => setIsEditing(true)}
                disabled={isEditing}
              >
                <EditIcon />
              </IconButton>
            </Box>
            <Box className="form-box">
              <Box className="formHeading">
                <InputLabel>Sports</InputLabel>
                <TextField
                  label=""
                  variant="standard"
                  disabled={!isEditing}
                  name="sports"
                  value={formData.sports}
                  onChange={handleInputChange}
                  fullWidth
                  error={!!formErrors.sports}
                  helperText={formErrors.sports || ""}
                />
              </Box>
              <Box className="formHeading">
                <InputLabel>Music</InputLabel>
                <TextField
                  label=""
                  variant="standard"
                  disabled={!isEditing}
                  name="music"
                  value={formData.music}
                  onChange={handleInputChange}
                  fullWidth
                  error={!!formErrors.music}
                  helperText={formErrors.music || ""}
                />
              </Box>
              <Box className="formHeading">
                <InputLabel>Movies</InputLabel>
                <TextField
                  label=""
                  variant="standard"
                  disabled={!isEditing}
                  name="movies"
                  value={formData.movies}
                  onChange={handleInputChange}
                  fullWidth
                  error={!!formErrors.movies}
                  helperText={formErrors.movies || ""}
                />
              </Box>
              <Box className="formHeading">
                <InputLabel>Hobbies</InputLabel>
                <TextField
                  label=""
                  variant="standard"
                  disabled={!isEditing}
                  name="hobbies"
                  value={formData.hobbies}
                  onChange={handleInputChange}
                  fullWidth
                  error={!!formErrors.hobbies}
                  helperText={formErrors.hobbies || ""}
                />
              </Box>
              <Box className="formHeading">
                <InputLabel>Food Preferences</InputLabel>
                <TextField
                  label=""
                  variant="standard"
                  disabled={!isEditing}
                  name="foodpreferences"
                  value={formData.foodpreferences}
                  onChange={handleInputChange}
                  fullWidth
                  error={!!formErrors.foodpreferences}
                  helperText={formErrors.foodpreferences || ""}
                />
              </Box>
              <Box className="formHeading">
                <InputLabel>Travel Preferences</InputLabel>
                <TextField
                  label=""
                  variant="standard"
                  disabled={!isEditing}
                  name="travelpreferences"
                  value={formData.travelpreferences}
                  onChange={handleInputChange}
                  fullWidth
                  error={!!formErrors.travelpreferences}
                  helperText={formErrors.travelpreferences || ""}
                />
              </Box>
              <Box className="formHeading">
                <InputLabel>Other Interest</InputLabel>
                <TextField
                  label=""
                  variant="standard"
                  disabled={!isEditing}
                  name="others"
                  value={formData.others}
                  onChange={handleInputChange}
                  fullWidth
                  error={!!formErrors.others}
                  helperText={formErrors.others || ""}
                />
              </Box>
            </Box>
            {isEditing && (
              <CommonButton
                Name2="Submit"
                Name1="Cancel"
                formId="PersonInterest"
                handleBack={() => setIsEditing(false)}
              />
            )}
          </form>
        </Box>
      )}
      {loader ? <CommonLoader /> : null}
    </div>
  );
};

export default PersonInterest;
