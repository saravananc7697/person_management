import React from "react";
import MainDoc from "../../../../Components/CommonUploadDoc/MainDoc";

const PersonDocoument = ({ personID }) => {
  return (
    <div>
      <MainDoc indval={personID} pathValue="Person" />
    </div>
  );
};

export default PersonDocoument;
