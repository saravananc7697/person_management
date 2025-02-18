import { Box, Paper } from "@mui/material";
import React, { useEffect, useState } from "react";
import ProfilePage from "../../Components/CommonProfile/ProfilePage";
import TopBar from "../../Components/CommonMenuBar/TopBar";
import { useParams } from "react-router-dom";

const AdminProfile = () => {
  const [animate, setAnimate] = useState(false);
  const { personid } = useParams();

  console.log(personid);

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
      <Box className={`detail-box ${animate ? "animate" : ""} bgstyle`}>
        <ProfilePage />
      </Box>
    </Box>
  );
};

export default AdminProfile;
