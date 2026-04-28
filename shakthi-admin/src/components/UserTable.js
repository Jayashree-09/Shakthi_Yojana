import React from "react";
import "../styles/universal.css";

function Table({ columns, data }) {
  return (
    <table className="table">
      <thead>
        <tr>
          {columns.map((col, index) => (
            <th key={index}>{col}</th>
          ))}
        </tr>
      </thead>

      <tbody>
        {data && data.length > 0 ? (
          data.map((row, rowIndex) => (
            <tr key={row._id || rowIndex}>
              {columns.map((col, colIndex) => (
                <td key={colIndex}>
                  {row[col.toLowerCase()] || "N/A"}
                </td>
              ))}
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={columns.length} style={{ textAlign: "center" }}>
              No Data Available
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}

export default Table;