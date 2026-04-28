import { useState, useEffect } from "react";
import API from "../services/api";

function AdminRoles() {
  const [roles, setRoles] = useState([]);
  const [newRole, setNewRole] = useState("");

  const fetchRoles = async () => {
    const res = await API.get("/roles");
    setRoles(res.data);
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const addRole = async () => {
    await API.post("/roles", { name: newRole });
    setNewRole("");
    fetchRoles();
  };

  return (
    <div>
      <h2>Manage Roles</h2>

      <input
        value={newRole}
        onChange={(e) => setNewRole(e.target.value)}
        placeholder="Enter role (e.g. worker)"
      />
      <button onClick={addRole}>Add Role</button>

      <ul>
        {roles.map(r => <li key={r._id}>{r.name}</li>)}
      </ul>
    </div>
  );
}

export default AdminRoles;