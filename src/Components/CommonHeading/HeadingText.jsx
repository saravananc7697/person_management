import React from "react";
import { Box, Typography } from "@mui/material";

const HeadingText = ({ headtext }) => {
  return (
    <div>
      <Box className="form-heading">
        <Typography>{headtext}</Typography>
      </Box>
    </div>
  );
};

export default HeadingText;
