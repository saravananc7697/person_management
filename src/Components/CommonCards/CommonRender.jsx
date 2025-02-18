import React from "react";
import PersonTribe from "../../Pages/DashboardPage/DashboardContent/TribeDetails/PersonTribe";
import PersonSchool from "../../Pages/DashboardPage/DashboardContent/Education-place/PersonSchool";
import RelationShipType from "../../Pages/DashboardPage/DashboardContent/RelationShipType/RelationShipType";
import PersonUniversity from "../../Pages/DashboardPage/DashboardContent/Education-place/PersonUniversity";
import OrganzinationDetails from "../../Pages/DashboardPage/DashboardContent/OrganzinationDetails/OrganzinationDetails";
import { Box, Typography } from "@mui/material";

const CommonRender = ({ pageName, personID }) => {
  return (
    <>
      <div className="popupBox ">
        <Box>
          <Typography className="popupHeading headspacing">
            {pageName} Details
          </Typography>
        </Box>
        <Box className="outSpacing">
          {pageName === "Tribe" ? (
            <PersonTribe personID={personID} />
          ) : pageName === "School" ? (
            <PersonSchool personID={personID} />
          ) : pageName === "University" ? (
            <PersonUniversity personID={personID} />
          ) : pageName === "RelationshipType" ? (
            <RelationShipType personID={personID} />
          ) : pageName === "Organization" ? (
            <OrganzinationDetails personID={personID} />
          ) : null}
        </Box>
      </div>
    </>
  );
};

export default CommonRender;
