import { React, useEffect, useState } from "react";
import TopBar from "../../Components/CommonMenuBar/TopBar";
import { styled } from "@mui/material/styles";
import { Box, Grid, Paper } from "@mui/material";
import ProfilePage from "../../Components/CommonProfile/ProfilePage";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import PersonDetailTab from "./PersonContent/PersonDetailTab";
import { useParams } from "react-router-dom";

const theme = createTheme();

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fcfcfc",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

const PersonDetails = () => {
  const { personid } = useParams();
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
        <Grid item xs={4} className={`profile-box ${animate ? "animate" : ""}`}>
          <Item>
            <ProfilePage personID={personid} />
          </Item>
        </Grid>
        <Grid item xs={8} className={`detail-box ${animate ? "animate" : ""}`}>
          <Item>
            <ThemeProvider theme={theme}>
              <PersonDetailTab personID={personid} />
            </ThemeProvider>
          </Item>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PersonDetails;
