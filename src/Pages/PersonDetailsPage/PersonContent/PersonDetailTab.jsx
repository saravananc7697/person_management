import * as React from "react";
import PropTypes from "prop-types";
import {
  Tabs,
  Tab,
  Typography,
  Box,
  Stack,
  useMediaQuery,
} from "@mui/material";
import PersonGovDetails from "./PersonDetailsList/PersonGovDetails";
import PersonContact from "./PersonDetailsList/PersonContact";
import PeresonAddress from "./PersonDetailsList/PeresonAddress";
import PersonIncome from "./PersonDetailsList/PersonIncome";
import PersonExpence from "./PersonDetailsList/PersonExpence";
import PersonImmunization from "./PersonDetailsList/PersonImmunization";
import PersonHealthInsurance from "./PersonDetailsList/PersonHealthInsurance";
import PersonMedicalCondition from "./PersonDetailsList/PersonMedicalCondition";
import PersonConsent from "./PersonDetailsList/PersonConsent";
import PersonRelation from "./PersonDetailsList/PersonRelationShip/PersonRelation";
import PersonTribeAffiliation from "./PersonDetailsList/PersonTribe/PersonTribeAffiliation";
import PersonMedication from "./PersonDetailsList/PersonMedical/PersonMedication";
import PersonEducation from "./PersonDetailsList/PersonEducation/PersonEducation";
import PersonEmployement from "./PersonDetailsList/PersonEmployment/PersonEmployement";
import PersonDocoument from "./PersonDetailsList/PersonDocoument";
import PersonBioDetail from "./PersonDetailsList/PersonBioDetail";

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default function PersonDetailTab({ personID }) {
  const [value, setValue] = React.useState(0);
  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("sm"));

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box className="common-container">
      <Box className="tabsBox">
        <Tabs
          value={value}
          onChange={handleChange}
          variant="scrollable"
          scrollButtons="auto"
          aria-label="scrollable auto tabs example"
        >
          <Tab label="Details" {...a11yProps(0)} />
          <Tab label="Identity" {...a11yProps(1)} />
          <Tab label="Contact" {...a11yProps(2)} />
          <Tab label="Address" {...a11yProps(3)} />
          <Tab label="Income" {...a11yProps(4)} />
          <Tab label="Expense" {...a11yProps(5)} />
          <Tab label="Immunization" {...a11yProps(6)} />
          <Tab label="HealthInsurance" {...a11yProps(7)} />
          <Tab label="MedicalCondition" {...a11yProps(8)} />
          <Tab label="Consent" {...a11yProps(9)} />
          <Tab label="RelationShip" {...a11yProps(10)} />
          <Tab label="Education" {...a11yProps(11)} />
          <Tab label="Tribe Affiliation" {...a11yProps(12)} />
          <Tab label="Medication" {...a11yProps(13)} />
          <Tab label="Employment" {...a11yProps(14)} />
          <Tab label="Attachement" {...a11yProps(15)} />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <PersonBioDetail personID={personID} />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <PersonGovDetails personID={personID} />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        <PersonContact personID={personID} />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={3}>
        <PeresonAddress personID={personID} />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={4}>
        <PersonIncome personID={personID} />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={5}>
        <PersonExpence personID={personID} />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={6}>
        <PersonImmunization personID={personID} />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={7}>
        <PersonHealthInsurance personID={personID} />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={8}>
        <PersonMedicalCondition personID={personID} />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={9}>
        <PersonConsent personID={personID} />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={10}>
        <PersonRelation personID={personID} />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={11}>
        <PersonEducation personID={personID} />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={12}>
        <PersonTribeAffiliation personID={personID} />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={13}>
        <PersonMedication personID={personID} />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={14}>
        <PersonEmployement personID={personID} />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={15}>
        <PersonDocoument personID={personID} />
      </CustomTabPanel>
    </Box>
  );
}
