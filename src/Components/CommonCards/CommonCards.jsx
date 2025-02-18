import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Paper,
  Grid,
  IconButton,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { Delete } from "@mui/icons-material";
import CommonModal from "../CommonModal/CommonModal";
import CommonRender from "./CommonRender";

const CommonCards = ({
  data,
  hiddenKeys,
  Name,
  handleDeleteClick,
  handleEditClick,
  idKeyName,
  keyNameToAlert,
  pageName,
}) => {
  const [clickedId, setClickedId] = useState(null);
  const [open, setOpen] = useState(false);
  const [pageNameVal, setPageName] = useState("");

  const handleValueClick = (key, value) => {
    if (key === keyNameToAlert) {
      setOpen(true);
      setClickedId(value);
      setPageName(pageName);
    } else if (key === "universityid") {
      setPageName("University");
      setOpen(true);
      setClickedId(value);
    }
  };

  return (
    <Box>
      {open ? (
        <CommonModal
          open={open}
          onClose={() => setOpen(false)}
          title="My Modal Title"
          content="Modal Content Goes Here"
        >
          <CommonRender personID={clickedId} pageName={pageNameVal} />
        </CommonModal>
      ) : (
        <>
          {data.map((item, index) => (
            <Card key={index} className="cardContainer spacing">
              <CardContent>
                <Box className="cardBox spacing">
                  <Typography variant="h6">
                    {Name} ({index + 1})
                  </Typography>
                  <Box>
                    <IconButton
                      onClick={() =>
                        handleEditClick(item[idKeyName], idKeyName)
                      }
                      aria-label="edit"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      onClick={() =>
                        handleDeleteClick(item[idKeyName], idKeyName)
                      }
                      aria-label="delete"
                    >
                      <Delete />
                    </IconButton>
                  </Box>
                </Box>
                <Grid container spacing={2} className="formCommonCard">
                  {Object.entries(item).map(
                    ([key, value]) =>
                      !hiddenKeys.includes(key) && (
                        <Grid item xs={6} key={key} className="cardBox">
                          <Typography variant="subtitle1" className="keyName">
                            {key}
                          </Typography>
                          <Typography
                            variant="body1"
                            color="textSecondary"
                            onClick={() => handleValueClick(key, value)}
                          >
                            {key === keyNameToAlert ||
                            key === "universityid" ? (
                              <Typography
                                variant="subtitle1"
                                className="alertValue"
                              >
                                {value} (view)
                              </Typography>
                            ) : (
                              <Typography
                                variant="subtitle1"
                                className="keyName"
                              >
                                {value}
                              </Typography>
                            )}
                          </Typography>
                        </Grid>
                      )
                  )}
                </Grid>
              </CardContent>
            </Card>
          ))}
        </>
      )}
    </Box>
  );
};

export default CommonCards;
