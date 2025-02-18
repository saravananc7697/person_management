import { React, useContext, useState } from "react";
import CommonDataTable from "../../../../Components/CommonDataTable/CommonDataTable";
import { ApiContext } from "../../../../Context-data/ApiContext";
import CircularProgress from "@mui/material/CircularProgress";
import CommonAvtar from "../../../../Components/CommonAvtar/CommonAvtar";
import { useNavigate } from "react-router-dom";
import ApiService from "../../../../Service/ApiService";

const AllPersonList = ({ handleTabChange, setSelectedRowId }) => {
  const navigate = useNavigate();
  const apiURL = process.env.REACT_APP_BASE_URL;
  const { personData } = useContext(ApiContext);
  const columns = [
    { field: "id", headerName: "", width: 100 },
    {
      field: "avatar",
      headerName: "Avatar",
      width: 150,
      renderCell: (params) => (
        <div className="personName">
          <CommonAvtar avtName={params.row.firstname} />
        </div>
      ),
    },
    {
      field: "firstname",
      headerName: "First Name",
      width: 200,
      renderCell: (params) => (
        <div className="personName" onClick={() => handlePersonClick(params)}>
          {params.value}
        </div>
      ),
    },
    { field: "lastname", headerName: "Last Name", width: 200 },
    { field: "personnumber", headerName: "Person Number", width: 200 },
    { field: "gender", headerName: "Gender", width: 200 },
    { field: "dateofbirth", headerName: "Date oF Birth", width: 200 },

  ];

  const handlePersonClick = (params) => {
    const personId = params.row.personid;
    navigate(`/dashboard/person/${personId}`);
  };

  const handleEdit = (rowId) => {
    handleTabChange(1);
    setSelectedRowId(rowId);
  };

  const handleDelete = (rowId) => {
    const apiUrl = `${apiURL}/person/${rowId}`;
    ApiService.request("DELETE", apiUrl)
      .then((data) => {
        alert("Data Deleted Sucessfully");
        window.location.reload();
      })
      .catch((error) => {
        alert("Something Went Wrong Please try after some time");
      });
  };

  return (
    <div>
      {!personData ? (
        <CircularProgress />
      ) : (
        <CommonDataTable
          data={personData}
          columns={columns}
          onEdit={handleEdit}
          onDelete={handleDelete}
          rowIdKey="rowId"
        />
      )}
    </div>
  );
};

export default AllPersonList;
