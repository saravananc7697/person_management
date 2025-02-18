import { Button } from "@mui/material";
import React from "react";
import { useTheme } from "@mui/material/styles";

const CommonButton = ({ handleBack, formId, Name1, Name2 }) => {
  const theme = useTheme();
  const getClassBasedOnMode = () => {
    return theme.palette.mode === "dark" ? "dark-mode" : "light-mode";
  };

  return (
    <div className="btn-box">
      <div className={`btn-container ${getClassBasedOnMode()}`}>
        <Button
          className="backbtn"
          variant="outlined"
          color="primary"
          onClick={() => handleBack()}
        >
          {Name1}
        </Button>
        <Button variant="contained" color="primary" type="submit" form={formId}>
          {Name2}
        </Button>
      </div>
    </div>
  );
};

export default CommonButton;
