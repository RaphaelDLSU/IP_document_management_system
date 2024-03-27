import React from "react";

const ReadOnlyRow = ({ input, handleEditClick, handleDeleteClick }) => {
  return (
    <tr>
      <td>{input.unitNumberTag}</td>
      <td>{input.serviceAreaType}</td>
      <td>{input.serviceAreaSize}</td>
      <td>
        <button
          type="button"
          onClick={(event) => handleEditClick(event, input)}
        >
          Edit
        </button>
        <button type="button" onClick={() => handleDeleteClick(input.id)}>
          Delete
        </button>
      </td>
    </tr>
  );
};

export default ReadOnlyRow;
