import React, { useContext, useState } from "react";
import { ApiContext } from "../../../../Context-data/ApiContext";
import CircularProgress from "@mui/material/CircularProgress";
import {
  Box,
  InputLabel,
  TextField,
  FormControl,
  Select,
  MenuItem,
  Card,
  Button,
  Grid,
  Typography,
} from "@mui/material";
import CommonCards from "../../../../Components/CommonCards/CommonCards";
import AddIcon from "@mui/icons-material/Add";
import CommonButton from "../../../../Components/CommonButton/CommonButton";
import CommonModal from "../../../../Components/CommonModal/CommonModal";
import { frequency } from "../../../../DummyObject/ObjectVal";
import HeadingText from "../../../../Components/CommonHeading/HeadingText";
import ApiService from "../../../../Service/ApiService";
import { validatePersonContact } from "../../../../Validation/Validation";
import dayjs from "dayjs";
import Stack from "@mui/material/Stack";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers";

const PersonExpence = ({ personID }) => {
  const { personExpense } = useContext(ApiContext);
  const isPersonIDValid = personID != null && personID !== "";
  const rowData =
    personExpense && isPersonIDValid
      ? personExpense.filter((person) => person.personid == personID)
      : [];

  // console.log(rowData);

  const defaultRowData = {
    category: "",
    frequency: "",
    description: "",
    amount: null,
  };

  const initialFormData =
    rowData.length > 0 ? { ...defaultRowData, ...rowData[0] } : defaultRowData;

  const initialDateValues = {
    expensedate: initialFormData.expensedate
      ? dayjs(initialFormData.expensedate)
      : null,
  };

  const hiddenKeys = ["id", "personid", "person", "expenseid"];
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [formErrors, setFormErrors] = useState({});
  const apiURL = process.env.REACT_APP_BASE_URL;
  const [dateValues, setDateValues] = useState(initialDateValues);
  const [editData, setEditData] = useState({});

  const handleEditClick = (objectId) => {
    const editedData = rowData.find((person) => person.expenseid === objectId);
    setEditData(editedData);
    if (editedData) {
      setFormData({ ...defaultRowData, ...editedData });
      setDateValues({
        expensedate: editedData.expensedate
          ? dayjs(editedData.expensedate)
          : null,
      });
      setOpen(true);
    }
  };

  const handleAddNewClick = () => {
    setFormData(defaultRowData);
    setOpen(true);
    setDateValues({
      expensedate: null,
    });
  };

  const handleDeleteClick = (objectId) => {
    const apiUrl = `${apiURL}/Expense/${objectId}`;
    ApiService.request("DELETE", apiUrl)
      .then((data) => {
        alert("Data Deleted Sucessfully");
        window.location.reload();
      })
      .catch((error) => {
        alert("Something Went Wrong Please try after some time");
      });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const numericFields = ["amount"];

    const parsedValue = numericFields.includes(name)
      ? parseInt(value, 10)
      : value;

    setFormData({
      ...formData,
      [name]: parsedValue,
    });

    setFormErrors({
      ...formErrors,
      [name]: "",
    });
  };

  const handleDateChange = (fieldName, newValue) => {
    const formattedDate = newValue !== null ? newValue : "";
    setDateValues((prevDateValues) => ({
      ...prevDateValues,
      [fieldName]: formattedDate,
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const formattedDateValues = {};

    Object.keys(dateValues).forEach((key) => {
      const dateValue = dateValues[key];
      if (dateValue) {
        if (key === "incidentDateAndTime") {
          formattedDateValues[key] = dateValue.format("YYYY-MM-DDTHH:mm:ss");
        } else {
          formattedDateValues[key] = dateValue.format("YYYY-MM-DD");
        }
      } else {
        formattedDateValues[key] = null;
      }
    });

    const errors = validatePersonContact(formData);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
    } else {
      setFormErrors({});

      try {
        const apiUrl = `${apiURL}/Expense`;
        if (editData && editData.expenseid) {
          const postData = {
            ...formData,
            ...formattedDateValues,
          };
          postData.expenseid = editData.expenseid;
          console.log(postData);
          const responseData = await ApiService.request(
            "PUT",
            apiUrl,
            postData
          );
          console.log("person api Response (PUT):", responseData);
          alert("Data Updated Successfully!");
        } else {
          const postData2 = {
            ...formData,
            ...formattedDateValues,
            personid: personID,
          };
          console.log(postData2);
          const responseData = await ApiService.request(
            "POST",
            apiUrl,
            postData2
          );
          console.log("person api Response (POST):", responseData);
          alert("Data Created Successfully!");
        }
        window.location.reload();
      } catch (error) {
        console.error("Error occurred during request in Person:", error);
        return alert("something went wrong");
      }
    }
  };

  return (
    <div>
      {!personExpense ? (
        <CircularProgress />
      ) : (
        <Box>
          <Box>
            <CommonCards
              data={rowData}
              hiddenKeys={hiddenKeys}
              Name="Expense Details"
              handleEditClick={handleEditClick}
              handleDeleteClick={handleDeleteClick}
              idKeyName="expenseid"
            />
          </Box>
          <Card className="ContextCard">
            <Button
              variant="contained"
              color="primary"
              className="addButton"
              startIcon={<AddIcon />}
              onClick={handleAddNewClick}
            >
              Add New Expense
            </Button>
          </Card>
        </Box>
      )}
      {open ? (
        <CommonModal
          open={open}
          onClose={() => setOpen(false)}
          title="My Modal Title"
          content="Modal Content Goes Here"
        >
          <Box className="contentBox">
            <form id="form" onSubmit={handleFormSubmit}>
              <HeadingText headtext="Expense Details" />
              <Grid
                container
                rowSpacing={1}
                columnSpacing={{ xs: 1, sm: 2, md: 3 }}
                className="form-box"
              >
                <Grid item xs={6}>
                  <InputLabel>Category</InputLabel>
                  <TextField
                    label=""
                    variant="standard"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    fullWidth
                    error={!!formErrors.category}
                    helperText={formErrors.category || ""}
                  />
                </Grid>
                <Grid item xs={6}>
                  <InputLabel>Frequency</InputLabel>
                  <FormControl fullWidth>
                    <Select
                      name="frequency"
                      value={formData.frequency}
                      onChange={handleInputChange}
                      variant="standard"
                      label=""
                      error={!!formErrors.frequency}
                      helperText={formErrors.frequency || ""}
                    >
                      {frequency.map((frequencyOption) => (
                        <MenuItem key={frequencyOption} value={frequencyOption}>
                          {frequencyOption}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={6}>
                  <InputLabel>Amount</InputLabel>
                  <TextField
                    label=""
                    variant="standard"
                    name="amount"
                    value={formData.amount}
                    onChange={handleInputChange}
                    fullWidth
                    type="number"
                    error={!!formErrors.amount}
                    helperText={formErrors.amount || ""}
                  />
                </Grid>
                <Grid item xs={6}>
                  <InputLabel>Expense Date</InputLabel>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <Stack>
                      <DatePicker
                        value={dateValues.expensedate}
                        onChange={(newValue) =>
                          handleDateChange("expensedate", newValue)
                        }
                        referenceDate={dayjs("2022-04-17")}
                        format="YYYY-MM-DD"
                        slotProps={{ textField: { size: "small", variant: "standard" }, }}
                        className="DateInput"
                      />
                    </Stack>
                  </LocalizationProvider>
                  {formErrors.expensedate && (
                    <Typography variant="body2" color="error">
                      {formErrors.expensedate}
                    </Typography>
                  )}
                </Grid>
                <Grid item xs={12}>
                  <InputLabel>Description</InputLabel>
                  <TextField
                    label=""
                    variant="standard"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    fullWidth
                    error={!!formErrors.description}
                    helperText={formErrors.description || ""}
                  />
                </Grid>
              </Grid>
              <CommonButton
                Name2="Submit"
                Name1="Cancel"
                formId="form"
                handleBack={() => setOpen(false)}
              />
            </form>
          </Box>
        </CommonModal>
      ) : null}
    </div>
  );
};

export default PersonExpence;
