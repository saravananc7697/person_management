import { React, useContext, useState } from "react";
import { ApiContext } from "../../../../Context-data/ApiContext";
import CircularProgress from "@mui/material/CircularProgress";
import {
  Box,
  InputLabel,
  TextField,
  Typography,
  IconButton,
  Tooltip,
} from "@mui/material";
import CommonLoader from "../../../../Components/CommonLoder/CommonLoader";
import CommonButton from "../../../../Components/CommonButton/CommonButton";
import ApiService from "../../../../Service/ApiService";
import EditIcon from "@mui/icons-material/Edit";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import LanguageIcon from "@mui/icons-material/Language";

const PersonSocialMedia = ({ personID }) => {
  const { personSocial } = useContext(ApiContext);
  const isPersonIDValid = personID != null && personID !== "";
  const rowData =
    personSocial && isPersonIDValid
      ? personSocial.find((person) => person.personid == personID)
      : null;

  // console.log(rowData);

  const defaultRowData = {
    facebookurl: "",
    twitterhandle: "",
    instagramhandle: "",
    linkedinprofile: "",
    websiteurl: "",
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
    // const errors = validatepersonSocial(formData);
    // if (Object.keys(errors).length > 0) {
    //   setFormErrors(errors);
    // } else {
    //   setFormErrors({});
    //   setLoader(true);

    try {
      const postData = {
        ...formData,
      };

      const apiUrl = `${apiURL}/OnlinePresence`;
      if (rowData && Object.keys(rowData).length !== 0 && rowData.id) {
        postData.id = rowData.id;

        const responseData = await ApiService.request("PUT", apiUrl, postData);
        console.log("person Social Info api Response (PUT):", responseData);
        alert("Person Social Info Updated Successfully!");
      } else {
        const postData2 = {
          ...formData,
          personid: personID,
        };
        console.log(postData2);
        // return false
        const responseData = await ApiService.request(
          "POST",
          apiUrl,
          postData2
        );
        console.log("person Social Info api Response (POST):", responseData);
        alert("person Social Info Created Successfully!");
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
      {!personSocial ? (
        <CircularProgress />
      ) : (
        <Box className="commonBox">
          <form id="personSocial" onSubmit={handleFormSubmit}>
            <Box className="formHeading">
              <Typography>Social Media Handles</Typography>
              <IconButton
                onClick={() => setIsEditing(true)}
                disabled={isEditing}
              >
                <EditIcon />
              </IconButton>
            </Box>
            <Box className="form-box">
              <Box className="formHeading">
                <InputLabel>
                  <Tooltip title="Facebook">
                    <FacebookIcon />
                  </Tooltip>
                </InputLabel>
                <TextField
                  label=""
                  variant="standard"
                  disabled={!isEditing}
                  name="facebookurl"
                  value={formData.facebookurl}
                  onChange={handleInputChange}
                  fullWidth
                  error={!!formErrors.facebookurl}
                  helperText={formErrors.facebookurl || ""}
                />
              </Box>
              <Box className="formHeading">
                <InputLabel>
                  <Tooltip title="Twitter">
                    <TwitterIcon />
                  </Tooltip>
                </InputLabel>
                <TextField
                  label=""
                  variant="standard"
                  disabled={!isEditing}
                  name="twitterhandle"
                  value={formData.twitterhandle}
                  onChange={handleInputChange}
                  fullWidth
                  error={!!formErrors.twitterhandle}
                  helperText={formErrors.twitterhandle || ""}
                />
              </Box>
              <Box className="formHeading">
                <InputLabel>
                  <Tooltip title="Instagram">
                    <InstagramIcon />
                  </Tooltip>
                </InputLabel>
                <TextField
                  label=""
                  variant="standard"
                  disabled={!isEditing}
                  name="instagramhandle"
                  value={formData.instagramhandle}
                  onChange={handleInputChange}
                  fullWidth
                  error={!!formErrors.instagramhandle}
                  helperText={formErrors.instagramhandle || ""}
                />
              </Box>
              <Box className="formHeading">
                <InputLabel>
                  <Tooltip title="Linked In">
                    <LinkedInIcon />
                  </Tooltip>
                </InputLabel>
                <TextField
                  label=""
                  variant="standard"
                  disabled={!isEditing}
                  name="linkedinprofile"
                  value={formData.linkedinprofile}
                  onChange={handleInputChange}
                  fullWidth
                  error={!!formErrors.linkedinprofile}
                  helperText={formErrors.linkedinprofile || ""}
                />
              </Box>
              <Box className="formHeading">
                <InputLabel>
                  <Tooltip title="Website URL">
                    <LanguageIcon />
                  </Tooltip>
                </InputLabel>
                <TextField
                  label=""
                  variant="standard"
                  disabled={!isEditing}
                  name="websiteurl"
                  value={formData.websiteurl}
                  onChange={handleInputChange}
                  fullWidth
                  error={!!formErrors.websiteurl}
                  helperText={formErrors.websiteurl || ""}
                />
              </Box>
            </Box>
            {isEditing && (
              <CommonButton
                Name2="Submit"
                Name1="Cancel"
                formId="personSocial"
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

export default PersonSocialMedia;
