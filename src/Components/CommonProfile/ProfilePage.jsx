import { React, useContext, useState } from "react";
import {
  Grid,
  Paper,
  TextField,
  Typography,
  Box,
  Tabs,
  Tab,
  Stack,
  InputLabel,
} from "@mui/material";
import CommonAvtar from "../CommonAvtar/CommonAvtar";
import { dummyData } from "../../DummyObject/ObjectVal";
import { ApiContext } from "../../Context-data/ApiContext";
import CircularProgress from "@mui/material/CircularProgress";
import PersonInterest from "../../Pages/PersonDetailsPage/PersonContent/PersonDetailsList/PersonInterest";
import PersonSocialMedia from "../../Pages/PersonDetailsPage/PersonContent/PersonDetailsList/PersonSocialMedia";
import ProfilePhoto from "../../Pages/PersonDetailsPage/PersonContent/PersonDetailsList/ProfilePhoto";

const ProfilePage = ({ personID }) => {
  const { personData } = useContext(ApiContext);

  if (!personData) {
    return (
      <div>
        <CircularProgress />
      </div>
    );
  }

  const isPersonIDValid = personID != null && personID !== "";
  const matchData =
    personData && isPersonIDValid
      ? personData.find((person) => person.personid == personID)
      : null;

  const renderProfileField = (label, value) => (
    <Grid item xs={6} key={label}>
      <InputLabel>{label}</InputLabel>
      <TextField
        label=""
        value={value}
        variant="outlined"
        fullWidth
        disabled
        size="small"
        InputLabelProps={{ shrink: true }}
        InputProps={{ readOnly: true }}
        margin="normal"
        className="spacing"
      />
    </Grid>
  );

  return (
    <div>
      {!isPersonIDValid ? (
        <Grid container>
          <Typography className="adminProfile">Profile Information</Typography>
          <Grid item xs={12}>
            <Grid container className="dataProfile">
              <Grid item xs={4} className="adminPic">
                <CommonAvtar
                  avtName={dummyData.firstname}
                  className="adminpicSize"
                />
              </Grid>
              <Grid item xs={8} className="adminDetails">
                <Typography className="t-1">
                  {dummyData.firstname} {dummyData.lastname}
                </Typography>
                <Typography className="t-2">{dummyData.about}</Typography>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Grid container className="formStyle">
              {renderProfileField("Date oF Birth", dummyData.dateofbirth)}
              {renderProfileField("Age", dummyData.age)}
              {renderProfileField("Phone Number", dummyData.phoneNumber)}
              {renderProfileField("Occupation", dummyData.occupation)}
              {renderProfileField("Height", dummyData.height)}
              {renderProfileField("Weight", dummyData.weight)}
              {renderProfileField("Blood Type", dummyData.bloodtype)}
              {renderProfileField("Gender", dummyData.gender)}
              {renderProfileField("Marital Status", dummyData.maritalstatus)}
              {renderProfileField("Citizenship", dummyData.citizenship)}
              {renderProfileField("Religion", dummyData.religion)}
              {renderProfileField("Spoken Language", dummyData.languagesspoken)}
            </Grid>
            {/* <CommonButton Name1="Edit" Name2="Log Out" /> */}
          </Grid>
        </Grid>
      ) : (
        <Grid container>
          <Grid item xs={12}>
            <Paper elevation={3} className="profile-dp">
              {/* <CommonAvtar avtName={matchData.firstname} /> */}
              <ProfilePhoto indval={personID} avtName={matchData.firstname} pathValue="PersonManagement"/>
            </Paper>
          </Grid>
          <Grid item xs={12} mt={3}>
            <Box mb={3}>
              <Typography variant="h5" gutterBottom>
                {matchData.firstname} {matchData.lastname}
              </Typography>
              <Typography className="personNumber">
                {matchData.personnumber}
              </Typography>
            </Box>
            <Box className="common-container">
              <PersonSocialMedia personID={personID} />
              <PersonInterest personID={personID} />
              {/* <PersonGovDetails personID={personID} /> */}
            </Box>
          </Grid>
        </Grid>
      )}
    </div>
  );
};

export default ProfilePage;
