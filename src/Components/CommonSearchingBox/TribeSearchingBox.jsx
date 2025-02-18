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

const TribeSearchingBox = ({ handleTribeChange }) => {
  const { personTribe } = useContext(ApiContext);

  const [formData, setFormData] = useState({
    tribename: "",
    tribelanguage: "",
    tribeid: "",
    triberegion: "",
    oldtribename: "",
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

    const contactsFound = personTribe.filter((contact) => {
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
    { field: "tribeid", headerName: "Tribe Id", width: 200 },
    { field: "tribename", headerName: "Tribe Name", width: 200 },
    { field: "tribelanguage", headerName: "Intake Language", width: 200 },
    { field: "triberegion", headerName: "Tribe Region", width: 200 },
    { field: "oldtribename", headerName: "Old Tribe Name", width: 200 },

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
    console.log(rowData.tribeid);
    handleTribeChange(rowData.tribeid);
  };

  return (
    <div>
      <Box>
        <Box sx={{ m: 1 }}>
          <Typography className="popupHeading headspacing">Search Tribe</Typography>
        </Box>
        <Box className="Manual-Box ">
          <form action="">
          <Box className="filterBox">
            <div className="form-Field">
              <Box className="label_box">
                <InputLabel>Tribe Id:</InputLabel>
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
                    name="tribeid"
                    value={formData.tribeid}
                    onChange={handleInputChange}
                    fullWidth
                    margin="normal"
                  />
                </Box>
              </Box>
            </div>
            <div className="form-Field">
              <Box className="label_box">
                <InputLabel>Tribe Name:</InputLabel>
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
                    name="tribename"
                    value={formData.tribename}
                    onChange={handleInputChange}
                    fullWidth
                    margin="normal"
                  />
                </Box>
              </Box>
            </div>
            <div className="form-Field">
              <Box className="label_box">
                <InputLabel>Tribe Language:</InputLabel>
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
                    name="tribelanguage"
                    value={formData.tribelanguage}
                    onChange={handleInputChange}
                    fullWidth
                    margin="normal"
                  />
                </Box>
              </Box>
            </div>
            <div className="form-Field">
              <Box className="label_box">
                <InputLabel>Tribe Region:</InputLabel>
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
                    name="triberegion"
                    value={formData.triberegion}
                    onChange={handleInputChange}
                    fullWidth
                    margin="normal"
                  />
                </Box>
              </Box>
            </div>
            <div className="form-Field">
              <Box className="label_box">
                <InputLabel>Old Tribe Name:</InputLabel>
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
                    name="oldtribename"
                    value={formData.oldtribename}
                    onChange={handleInputChange}
                    fullWidth
                    margin="normal"
                  />
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
                      getRowId={(row) => row.tribeid}
                    />
                  </Box>
                )}
              </Box>
            ) : null}
          </form>
        </Box>
      </Box>
    </div>
  );
};

export default TribeSearchingBox;
