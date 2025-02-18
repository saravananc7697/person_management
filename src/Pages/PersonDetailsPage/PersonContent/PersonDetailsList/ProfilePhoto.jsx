import React, { useEffect, useState } from "react";
import { Button, Avatar, Box } from "@mui/material";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import AWS from "aws-sdk";
import DeleteIcon from "@mui/icons-material/Delete";

const ProfilePhoto = ({ avtName, indval, pathValue }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [showDeleteIcon, setShowDeleteIcon] = useState(false);
  const [showSave, setShowSave] = useState(false);

  useEffect(() => {
    const s3 = new AWS.S3();
    const folderKey = `${pathValue}-${indval}/`;

    // List objects in the bucket
    const listParams = {
      Bucket: "bss3bitbucketpipeline",
      Prefix: folderKey,
    };

    s3.listObjectsV2(listParams, (err, data) => {
      if (err) {
        console.error("Error listing objects in the bucket:", err);
      } else {
        if (data.Contents.length > 0) {
          const latestObject = data.Contents[0];
          const latestFileName = latestObject.Key.split("/").pop();

          const getObjectParams = {
            Bucket: "bss3bitbucketpipeline",
            Key:
              folderKey + (selectedFile ? selectedFile.name : latestFileName),
          };

          // Retrieve the object from S3
          s3.getObject(getObjectParams, (err, data) => {
            if (err) {
              alert("Something Went Wrong Please try after some time");
            } else {
              // Set the retrieved image data as the preview image
              setPreviewImage(URL.createObjectURL(new Blob([data.Body])));
              setSelectedFile(null);
              setShowDeleteIcon(true);
            }
          });
        } else {
          setShowDeleteIcon(false);
        }
      }
    });
  }, [selectedFile]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedFile(file);
        setPreviewImage(reader.result);
        setShowSave(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = () => {
    if (!selectedFile) return;

    const s3 = new AWS.S3();
    const folderKey = `${pathValue}-${indval}/`;

    // List objects in the bucket
    const listParams = {
      Bucket: "bss3bitbucketpipeline",
      Prefix: folderKey,
    };

    s3.listObjectsV2(listParams, (err, data) => {
      if (err) {
        console.error("Error listing objects in the bucket:", err);
      } else {
        if (data.Contents.length > 0) {
          // Find the name of the previous image (if exists)
          const previousFileName = data.Contents[0].Key.split("/").pop();

          // Delete previous image if it exists and its name is different from the currently selected file
          if (previousFileName !== selectedFile.name) {
            const previousImageKey = folderKey + previousFileName;
            const deleteParams = {
              Bucket: "bss3bitbucketpipeline",
              Key: previousImageKey,
            };
            s3.deleteObject(deleteParams, (err, data) => {
              if (err) {
                console.error("Error deleting previous image:", err);
              } else {
                console.log("Previous image deleted successfully");
              }
            });
          }
        }

        // Upload new image
        const uploadParams = {
          Bucket: "bss3bitbucketpipeline",
          Key: folderKey + selectedFile.name,
          Body: selectedFile,
        };

        s3.upload(uploadParams, (err, data) => {
          if (err) {
            console.error("Error uploading file:", err);
          } else {
            alert("File uploaded successfully:");
            setShowDeleteIcon(true);
            setShowSave(false);
          }
        });
      }
    });
  };

  const handleDelete = () => {
    const s3 = new AWS.S3();
    const folderKey = `${pathValue}-${indval}/`;

    // List objects in the bucket with the specified prefix (folderKey)
    const listParams = {
      Bucket: "bss3bitbucketpipeline",
      Prefix: folderKey,
    };

    s3.listObjectsV2(listParams, (err, data) => {
      if (err) {
        console.error("Error listing objects in the bucket:", err);
      } else {
        if (data.Contents.length === 0) {
          console.log("No objects found in the folder:", folderKey);
          return;
        }

        // Create an array to store the delete parameters for each object
        const deleteParamsArray = data.Contents.map((object) => ({
          Bucket: "bss3bitbucketpipeline",
          Key: object.Key,
        }));

        // Delete each object individually
        deleteParamsArray.forEach((deleteParams) => {
          s3.deleteObject(deleteParams, (err, data) => {
            if (err) {
              alert("something went wrong please try after some time");
              console.error("Error deleting object:", err);
            } else {
              alert("Profile Photo Delete SucessFully");
              setShowDeleteIcon(false);
              window.location.reload();
            }
          });
        });

        // Clear the preview image and reset the selected file state
        setPreviewImage(null);
        setSelectedFile(null);
      }
    });
  };

  return (
    <div>
      <Box>
        <Box>
          <Avatar
            avtName={avtName}
            src={previewImage}
            style={{ width: 100, height: 100 }}
          ></Avatar>
        </Box>
        <Box>
          <input
            accept="image/*"
            style={{ display: "none" }}
            id="upload-photo"
            type="file"
            onChange={handleFileChange}
          />

          <label htmlFor="upload-photo">
            <AddPhotoAlternateIcon color="primary" />
          </label>

          {showDeleteIcon && (
            <label htmlFor="delete">
              <DeleteIcon onClick={handleDelete} color="action" />
            </label>
          )}
        </Box>
        {showSave && (
          <Box>
            <Button variant="contained" color="primary" onClick={handleUpload}>
              Save
            </Button>
          </Box>
        )}
      </Box>
    </div>
  );
};

export default ProfilePhoto;
