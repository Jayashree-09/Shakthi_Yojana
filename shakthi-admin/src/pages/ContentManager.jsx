import React, { useState } from "react";
import API from "../services/api";

function ContentManager() {
  const [key, setKey] = useState("");
  const [value, setValue] = useState("");

  const updateContent = () => {
    const token = localStorage.getItem("token");

    API.put(`/content/${key}`, { value }, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(() => alert("Updated ✅"))
      .catch((err) => console.log(err));
  };

  return (
    <div>
      <h2>CMS Panel</h2>

      <input placeholder="Key (ex: homepage_title)" onChange={(e) => setKey(e.target.value)} />
      <input placeholder="Value" onChange={(e) => setValue(e.target.value)} />

      <button onClick={updateContent}>Update</button>
    </div>
  );
}

export default ContentManager;