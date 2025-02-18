import { React, useState } from "react";
import AWS from "../../Aws-Credentials/aws-config";
import SFileList from "./SFileList";
import { useTheme } from "@mui/material/styles";
import { Button, TextField } from "@mui/material";

const MainDoc = ({ pathValue, indval }) => {
  const theme = useTheme();
  const getClassBasedOnMode = () => {
    return theme.palette.mode === "dark" ? "dark-mode" : "light-mode";
  };

  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = () => {
    if (!selectedFile) return;

    const s3 = new AWS.S3();
    const folderKey = `${pathValue}-${indval}/`;
    console.log(folderKey);

    const params = {
      Bucket: "bss3bitbucketpipeline",
      Key: folderKey + selectedFile.name,
      Body: selectedFile,
    };

    s3.upload(params, (err, data) => {
      if (err) {
        console.error("Error uploading file:", err);
      } else {
        alert("File uploaded successfully:");
        window.location.reload();
        setSelectedFile(null);
      }
    });
  };

  return (
    <div className="notes-box">
      <div className="heading-board">
        <div className={`box-heading ${getClassBasedOnMode()}`}>
          <div className="upload-file">
            <TextField
              type="file"
              onChange={handleFileChange}
              className="form-control"
            />
          </div>
          <div className="features-space">
            <Button className="btn" onClick={handleUpload}>
              Upload File
            </Button>
          </div>
        </div>
      </div>
      <div className="S3-list">
        <SFileList pathValue={pathValue} indval={indval} />
      </div>
    </div>
  );
};

export default MainDoc;
