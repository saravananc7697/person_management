import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import React, { useContext, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import SearchIcon from "@mui/icons-material/Search";
import { ApiContext } from "../../Context-data/ApiContext";
import { gender } from "../../DummyObject/ObjectVal";

const PersonSearchingBox = ({ handleIntakeIdChange }) => {
  const { personData } = useContext(ApiContext);

  const [formData, setFormData] = useState({
    personnumber: "",
    personid: "",
    firstname: "",
    lastname: "",
    gender: "",
    disabilitystatus: "",
  });
  const [matchingContacts, setMatchingContacts] = useState([]);
  const [showSearchRes, setShowSearchRes] = useState(false);
  const [matchKeyVal, setMatchkeyVal] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const findMatchingContact = () => {
    const filledFields = Object.entries(formData).filter(
      ([key, value]) => value !== null && value !== ""
    );

    if (filledFields.length === 0) {
      setMatchingContacts([]);
      setShowSearchRes(true);
      return;
    }

    const matchedKeys = {}; // Object to store matched keys

    const contactsFound = personData.filter((contact) => {
      return filledFields.every(([key, value]) => {
        const fieldValue = value.toLowerCase();
        const contactValue = String(contact[key]).toLowerCase();
        if (contactValue === fieldValue) {
          // Store the key if the values match
          matchedKeys[key] = true;
          return true;
        }
        return false;
      });
    });

    console.log("Matching Contacts:", contactsFound);

    // Log the keys whose values matched
    console.log("Matched Keys:", Object.keys(matchedKeys));
    setMatchkeyVal(matchedKeys);

    setMatchingContacts(contactsFound);
    setShowSearchRes(true);
  };
  const columns1 = [
    { field: "personnumber", headerName: "Intake Number", width: 150 },
    { field: "personid", headerName: "Intake Id", width: 150 },
    {
      field: "firstname",
      headerName: "First Name",
      width: 200,
    },
    { field: "lastname", headerName: "Last Name", width: 170 },
    { field: "gender", headerName: "Gender", width: 170 },
    { field: "disabilitystatus", headerName: "Disability Status", width: 170 },

    {
      field: "action",
      headerName: "Actions",
      width: 200,
      renderCell: (params) => (
        <Button variant="contained" onClick={() => handleLinkClick(params.row)}>
          Link
        </Button>
      ),
    },
  ];
  const handleLinkClick = (rowData) => {
    console.log(rowData.personid);
    handleIntakeIdChange(rowData.personid);
  };

  return (
    <div>
      <Box>
        <Box sx={{ m: 1 }}>
          <Typography className="popupHeading headspacing">
            Search Person
          </Typography>
        </Box>
        <form action="">
          <Box className="Manual-Box ">
            <Box className="filterBox">
              <div className="form-Field">
                <Box className="label_box">
                  <InputLabel>Person Id:</InputLabel>
                </Box>
                <Box className="form-TextField">
                  <Box className="select">
                    <FormControl size="small" fullWidth>
                      <InputLabel>Select</InputLabel>
                      <Select
                        name="preferredPronouns"
                        value={formData.preferredPronouns}
                        onChange={handleInputChange}
                        label="Select"
                      >
                        <MenuItem value={"Equals"}>Equals</MenuItem>
                        <MenuItem value={"Contains"}>Contains</MenuItem>
                      </Select>
                    </FormControl>
                  </Box>
                  <Box className="Input_field">
                    <TextField
                      size="small"
                      label=""
                      name="personid"
                      value={formData.personid}
                      onChange={handleInputChange}
                      fullWidth
                      margin="normal"
                    />
                  </Box>
                </Box>
              </div>
              <div className="form-Field">
                <Box className="label_box">
                  <InputLabel>Person Number:</InputLabel>
                </Box>
                <Box className="form-TextField">
                  <Box className="select">
                    <FormControl size="small" fullWidth>
                      <InputLabel>Select</InputLabel>
                      <Select
                        name="lastNameFilter"
                        value={formData.lastNameFilter}
                        onChange={handleInputChange}
                        label="Select"
                      >
                        <MenuItem value={"Equals"}>Equals</MenuItem>
                        <MenuItem value={"Contains"}>Contains</MenuItem>
                      </Select>
                    </FormControl>
                  </Box>
                  <Box className="Input_field">
                    <TextField
                      size="small"
                      label=""
                      name="personnumber"
                      value={formData.personnumber}
                      onChange={handleInputChange}
                      fullWidth
                      margin="normal"
                    />
                  </Box>
                </Box>
              </div>
              <div className="form-Field">
                <Box className="label_box">
                  <InputLabel>First Name:</InputLabel>
                </Box>
                <Box className="form-TextField">
                  <Box className="select">
                    <FormControl size="small" fullWidth>
                      <InputLabel>Select</InputLabel>
                      <Select
                        name="lastNameFilter"
                        value={formData.lastNameFilter}
                        onChange={handleInputChange}
                        label="Select"
                      >
                        <MenuItem value={"Equals"}>Equals</MenuItem>
                        <MenuItem value={"Contains"}>Contains</MenuItem>
                      </Select>
                    </FormControl>
                  </Box>
                  <Box className="Input_field">
                    <TextField
                      size="small"
                      label=""
                      name="firstname"
                      value={formData.firstname}
                      onChange={handleInputChange}
                      fullWidth
                      margin="normal"
                    />
                  </Box>
                </Box>
              </div>
              <div className="form-Field">
                <Box className="label_box">
                  <InputLabel>Last Name:</InputLabel>
                </Box>
                <Box className="form-TextField">
                  <Box className="select">
                    <FormControl size="small" fullWidth>
                      <InputLabel>Select</InputLabel>
                      <Select
                        name="lastNameFilter"
                        value={formData.lastNameFilter}
                        onChange={handleInputChange}
                        label="Select"
                      >
                        <MenuItem value={"Equals"}>Equals</MenuItem>
                        <MenuItem value={"Contains"}>Contains</MenuItem>
                      </Select>
                    </FormControl>
                  </Box>
                  <Box className="Input_field">
                    <TextField
                      size="small"
                      label=""
                      name="lastname"
                      value={formData.lastname}
                      onChange={handleInputChange}
                      fullWidth
                      margin="normal"
                    />
                  </Box>
                </Box>
              </div>
              <div className="form-Field">
                <Box className="label_box">
                  <InputLabel>Gender:</InputLabel>
                </Box>
                <Box className="form-TextField">
                  <Box className="select">
                    <FormControl size="small" fullWidth>
                      <InputLabel>Select</InputLabel>
                      <Select
                        name="lastNameFilter"
                        value={formData.lastNameFilter}
                        onChange={handleInputChange}
                        label="Select"
                      >
                        <MenuItem value={"Equals"}>Equals</MenuItem>
                        <MenuItem value={"Contains"}>Contains</MenuItem>
                      </Select>
                    </FormControl>
                  </Box>
                  <Box className="select">
                    <FormControl size="small" fullWidth>
                      <InputLabel></InputLabel>
                      <Select
                        name="status"
                        value={formData.status}
                        onChange={handleInputChange}
                        label="Select"
                      >
                        {gender.map((statusOption) => (
                          <MenuItem key={statusOption} value={statusOption}>
                            {statusOption}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>
                </Box>
              </div>
              <div className="form-Field">
                <Box className="label_box">
                  <InputLabel>Disability Status:</InputLabel>
                </Box>
                <Box className="form-TextField">
                  <Box className="select">
                    <FormControl size="small" fullWidth>
                      <InputLabel>Select</InputLabel>
                      <Select
                        name="lastNameFilter"
                        value={formData.lastNameFilter}
                        onChange={handleInputChange}
                        label="Select"
                      >
                        <MenuItem value={"Equals"}>Equals</MenuItem>
                        <MenuItem value={"Contains"}>Contains</MenuItem>
                      </Select>
                    </FormControl>
                  </Box>
                  <Box className="select">
                    <FormControl size="small" fullWidth>
                      <InputLabel></InputLabel>
                      <Select
                        name="disabilitystatus"
                        value={formData.disabilitystatus}
                        onChange={handleInputChange}
                        label="Select"
                      >
                        <MenuItem value={"Yes"}>Yes</MenuItem>
                        <MenuItem value={"No"}>No</MenuItem>
                      </Select>
                    </FormControl>
                  </Box>
                </Box>
              </div>
            </Box>
            <Box className="btnClassbox ">
              <Button
                variant="contained"
                onClick={findMatchingContact}
                startIcon={<SearchIcon />}
              >
                Search
              </Button>
            </Box>
            {showSearchRes ? (
              <Box className="">
                <Typography className="popupHeading headspacing">
                  Search Result
                </Typography>
                {matchingContacts.length === 0 ? (
                  <Typography align="center">No data found</Typography>
                ) : (
                  <Box className="outSpacing filterBox">
                    <DataGrid
                      rows={matchingContacts}
                      columns={columns1}
                      checkboxSelection
                      disableSelectionOnClick
                      columnBuffer={1}
                      pageSizeOptions={[5, 10, 25]}
                      className="tableBox"
                      getRowId={(row) => row.personid}
                    />
                  </Box>
                )}
              </Box>
            ) : null}
          </Box>
        </form>
      </Box>
    </div>
  );
};

export default PersonSearchingBox;
