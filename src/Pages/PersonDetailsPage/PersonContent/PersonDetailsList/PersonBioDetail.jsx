import React, { useContext } from "react";
import { ApiContext } from "../../../../Context-data/ApiContext";
import {
  CircularProgress,
  Grid,
  Typography,
  Box,
  CardContent,
  Card,
} from "@mui/material";

const excludedKeys = [
  "addresses",
  "consents",
  "educations",
  "employments",
  "expenses",
  "healthinsuranceinformationNominees",
  "healthinsuranceinformationPeople",
  "immunizations",
  "incomes",
  "interests",
  "medicalconditions",
  "medicationsNavigation",
  "onlinepresences",
  "personalidentifiers",
  "phoneandemails",
  "relationshipPeople",
  "relationshipRelatedpeople",
  "tribeaffiliations",
  "personid",
];

const PersonBioDetail = ({ personID }) => {
  const { personData } = useContext(ApiContext);

  const isPersonIDValid = personID != null && personID !== "";
  const matchData =
    personData && isPersonIDValid
      ? personData.find((person) => person.personid == personID)
      : null;

  if (!matchData) {
    return (
      <div>
        {" "}
        <CircularProgress />
      </div>
    );
  }

  const keys = Object.keys(matchData).filter(
    (key) => !excludedKeys.includes(key)
  );

  return (
    <Box className="cardContainer spacing">
      {!personData ? (
        <CircularProgress />
      ) : (
        <Card className="cardContainer spacing">
          <CardContent>
            <Box className="cardBox spacing">
              <Typography variant="h6">Person Details</Typography>
              <Box></Box>
            </Box>
            <Grid container spacing={2} className="formCommonCard">
              {keys.map((key) => (
                <Grid item xs={6} className="cardBox">
                  <Typography variant="subtitle1" className="keyName">
                    {key}
                  </Typography>
                  <Typography
                    variant="subtitle1"
                    className="keyName"
                    color="textSecondary"
                  >
                    {matchData[key]}
                  </Typography>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default PersonBioDetail;
