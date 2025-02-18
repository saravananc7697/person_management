import React from "react";
import Forgetform from "./Forgetform";

const Forget = () => {
  return (
    <div className="auth-container">
      <div className="signup authbox card">
        <div className="box">
          <video autoPlay muted loop>
            <source src="Gifs/ForgotPassword.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
        <div className="box box2">
          <Forgetform />
        </div>
      </div>
    </div>
  );
};

export default Forget;
