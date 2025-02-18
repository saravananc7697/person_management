import React, { useEffect, useState } from "react";
import AWS from "../../Aws-Credentials/aws-config";
import { Button } from "@mui/material";

const SFileList = ({ pathValue, indval }) => {
  console.log(pathValue, indval);
  const [fileList, setFileList] = useState([]);
  const [displayLimit, setDisplayLimit] = useState(4);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const s3 = new AWS.S3();

    const bucketName = "bss3bitbucketpipeline";
    const folderPath = `${pathValue}-${indval}/`;

    s3.listObjectsV2(
      { Bucket: bucketName, Prefix: folderPath },
      (err, data) => {
        if (err) {
          console.error("Error fetching S3 objects:", err);
        } else {
          const filteredFiles = data.Contents.filter((obj) =>
            obj.Key.includes(folderPath)
          );
          setFileList(filteredFiles);
        }
      }
    );
  }, []);

  const downloadFile = (key) => {
    const s3 = new AWS.S3();
    const bucketName = "bss3bitbucketpipeline";

    s3.getObject({ Bucket: bucketName, Key: key }, (err, data) => {
      if (err) {
        console.error("Error downloading file:", err);
      } else {
        const blob = new Blob([data.Body], { type: data.ContentType });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = key.split("/").pop();
        link.click();
        URL.revokeObjectURL(url);
      }
    });
  };

  const deleteFile = (key) => {
    const s3 = new AWS.S3();
    const bucketName = "bss3bitbucketpipeline";

    s3.deleteObject({ Bucket: bucketName, Key: key }, (err, data) => {
      if (err) {
        console.error("Error deleting file:", err);
      } else {
        // Refresh the file list after deletion
        const updatedFiles = fileList.filter((file) => file.Key !== key);
        setFileList(updatedFiles);
        alert("File Delete Sucessfully");
      }
    });
  };

  const handleViewAll = () => {
    setShowAll(true);
  };

  return (
    <div className="file-list">
      <table className="table table-hover tt">
        <thead>
          <tr>
            <th>File Name</th>
            <th>Type</th>
            <th>Last Modified</th>
            <th>Size</th>
            <th>Download</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {fileList
            .slice(0, showAll ? fileList.length : displayLimit)
            .map((file, index) => {
              const lastModified = new Date(
                file.LastModified
              ).toLocaleDateString();
              const size = `${(file.Size / 1024).toFixed(2)} KB`;

              const filenameParts = file.Key.split("/").pop().split(".");
              const fileExtension =
                filenameParts.length > 1 ? filenameParts.pop() : "";

              return (
                <tr key={index}>
                  <td>{file.Key.split("/").pop()}</td>
                  <td>{fileExtension}</td>
                  <td>{lastModified}</td>
                  <td>{size}</td>
                  <td>
                    <Button onClick={() => downloadFile(file.Key)}>
                      Download
                    </Button>
                  </td>
                  <td>
                    <Button onClick={() => deleteFile(file.Key)}>Delete</Button>
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>
      {!showAll && fileList.length > displayLimit && (
        <div className="view-more">
          <button className="viewbtn" onClick={handleViewAll}>
            View All
          </button>
        </div>
      )}
    </div>
  );
};

export default SFileList;
