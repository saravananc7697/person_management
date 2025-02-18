import { React, useContext, useEffect, useState } from "react";
import TopBar from "../../Components/CommonMenuBar/TopBar";
import { ApiContext } from "../../Context-data/ApiContext";
import { styled } from "@mui/material/styles";
import { Box, Grid, Paper } from "@mui/material";
import ProfilePage from "../../Components/CommonProfile/ProfilePage";
import DashboardTab from "./DashboardContent/DashboardTab";
import { ThemeProvider, createTheme } from "@mui/material/styles";
const theme = createTheme();

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

const Dashboard = () => {
  const { personData } = useContext(ApiContext);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setAnimate(true);
    }, 100);
  }, []);

  return (
    <Box>
      <Paper elevation={3}>
        <TopBar />
      </Paper>
      <Grid container spacing={2} className="grid-container">
        {/* <Grid item xs={4} className={`profile-box ${animate ? "animate" : ""}`}>
          <Item>
            <ProfilePage personData={personData} />
          </Item>
        </Grid> */}
        <Grid item xs={12} className={`detail-box ${animate ? "animate" : ""}`}>
          <Item>
            <ThemeProvider theme={theme}>
              <DashboardTab />
            </ThemeProvider>
          </Item>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
