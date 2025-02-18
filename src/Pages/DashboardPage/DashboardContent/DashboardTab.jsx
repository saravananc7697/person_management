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
import AddIcon from "@mui/icons-material/Add";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import AllPersonList from "./AllPersonList/AllPersonList";
import AddNewPerson from "./AddNewPerson/AddNewPerson";
import PersonTribe from "./TribeDetails/PersonTribe";
import PersonSchool from "./Education-place/PersonSchool";
import PersonUniversity from "./Education-place/PersonUniversity";
import SchoolIcon from "@mui/icons-material/School";
import GroupIcon from "@mui/icons-material/Group";
import ApartmentIcon from "@mui/icons-material/Apartment";
import RelationShipType from "./RelationShipType/RelationShipType";
import HandshakeIcon from "@mui/icons-material/Handshake";
import OrganzinationDetails from "./OrganzinationDetails/OrganzinationDetails";
import BusinessIcon from '@mui/icons-material/Business';

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

export default function DashboardTab() {
  const [value, setValue] = React.useState(0);
  const [selectedRowId, setSelectedRowId] = React.useState(null);
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
          <Tab
            label={
              <Stack direction="row" alignItems="center" spacing={1}>
                <ManageAccountsIcon />
                <Typography variant="body1">Person Management</Typography>
              </Stack>
            }
            {...a11yProps(0)}
          />
          <Tab
            label={
              <Stack direction="row" alignItems="center" spacing={1}>
                <AddIcon />
                <Typography variant="body1">New Person</Typography>
              </Stack>
            }
            {...a11yProps(1)}
          />
          {/* <Tab
            label={
              <Stack direction="row" alignItems="center" spacing={2}>
                <GroupIcon />
                <Typography variant="body1">Tribe</Typography>
              </Stack>
            }
            {...a11yProps(2)}
          />
          <Tab
            label={
              <Stack direction="row" alignItems="center" spacing={3}>
                <ApartmentIcon />
                <Typography variant="body1">School</Typography>
              </Stack>
            }
            {...a11yProps(3)}
          />
          <Tab
            label={
              <Stack direction="row" alignItems="center" spacing={4}>
                <SchoolIcon />
                <Typography variant="body1">University</Typography>
              </Stack>
            }
            {...a11yProps(4)}
          />
          <Tab
            label={
              <Stack direction="row" alignItems="center" spacing={4}>
                <HandshakeIcon />
                <Typography variant="body1">RelationShip</Typography>
              </Stack>
            }
            {...a11yProps(5)}
          />
            <Tab
            label={
              <Stack direction="row" alignItems="center" spacing={4}>
                <BusinessIcon />
                <Typography variant="body1">Organization</Typography>
              </Stack>
            }
            {...a11yProps(6)}
          /> */}
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <AllPersonList
          handleTabChange={setValue}
          setSelectedRowId={setSelectedRowId}
        />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <AddNewPerson rowId={selectedRowId} />
      </CustomTabPanel>
      {/* <CustomTabPanel value={value} index={2}>
        <PersonTribe />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={3}>
        <PersonSchool />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={4}>
        <PersonUniversity />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={5}>
        <RelationShipType />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={6}>
        <OrganzinationDetails />
      </CustomTabPanel> */}
    </Box>
  );
}
