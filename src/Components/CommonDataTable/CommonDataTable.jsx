import React, { useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { IconButton, Menu, MenuItem } from "@mui/material";
import { ExpandMore as ExpandMoreIcon } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";

const CommonDataTable = ({ data, columns, onEdit, onDelete, rowIdKey }) => {
  const theme = useTheme();

  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRowId, setSelectedRowId] = useState(null);

  const getClassBasedOnMode = () => {
    return theme.palette.mode === "dark" ? "dark-mode" : "light-mode";
  };

  const handleExpandClick = (event, personId) => {
    setAnchorEl(event.currentTarget);
    setSelectedRowId(personId);
  };

  const handleEditClick = () => {
    onEdit(selectedRowId);
    handleClose();
  };

  const handleDeleteClick = () => {
    onDelete(selectedRowId);
    handleClose();
  };

  const handleClose = () => {
    setAnchorEl(null);
    setSelectedRowId(null);
  };

  const renderActionCell = (params) => {
    return (
      <IconButton onClick={(e) => handleExpandClick(e, params.row.personid)}>
        <ExpandMoreIcon />
      </IconButton>
    );
  };

  const extendedColumns = [
    ...columns,
    {
      field: "action",
      headerName: "Action",
      width: 150,
      flex: 1,
      renderCell: renderActionCell,
    },
  ];

  const dataWithId = data.map((dataItem, index) => ({
    id: index + 1,
    ...dataItem,
  }));

  return (
    <div className={`commonContainer ${getClassBasedOnMode()} table-box`}>
      <DataGrid
        rows={dataWithId}
        columns={extendedColumns}
        checkboxSelection
        disableSelectionOnClick
        columnBuffer={1}
        initialState={{
          ...dataWithId.initialState,
          pagination: { paginationModel: { pageSize: 9 } },
        }}
        pageSizeOptions={[5, 10, 25]}
      />
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <MenuItem onClick={handleEditClick}>Edit</MenuItem>
        <MenuItem onClick={handleDeleteClick}>Delete</MenuItem>
      </Menu>
    </div>
  );
};

export default CommonDataTable;
