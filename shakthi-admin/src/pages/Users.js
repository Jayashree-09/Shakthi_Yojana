import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import API from "../services/api";
import "../styles/universal.css";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({
    name: "", email: "", password: "",
    role: "user", aadhaarNumber: "",
    state: "Karnataka", gender: "female",
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const fetchUsers = () => {
    API.get("/admin/users")
      .then((res) => setUsers(res.data || []))
      .catch((err) => console.log("Users Error:", err));
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleEdit = (user) => {
    setForm({
      name: user.name || "", email: user.email || "", password: "",
      role: user.role || "user", aadhaarNumber: user.aadhaarNumber || "",
      state: user.state || "Karnataka", gender: user.gender || "female",
    });
    setEditId(user._id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const resetForm = () => {
    setForm({ name: "", email: "", password: "", role: "user", aadhaarNumber: "", state: "Karnataka", gender: "female" });
    setEditId(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || (!editId && !form.password)) {
      alert("Please fill all required fields"); return;
    }

    if (editId) {
      API.put(`/admin/users/${editId}`, form)
        .then(() => { toast.success("User Updated ✅"); resetForm(); fetchUsers(); })
        .catch((err) => alert(err.response?.data?.message || "Update failed"));
    } else {
      API.post("/auth/register", {
        ...form,
        phoneNumber: form.phoneNumber || "0000000000",
        aadhaarNumber: form.aadhaarNumber || Math.floor(100000000000 + Math.random() * 900000000000).toString(),
      })
        .then(() => { toast.success("User Added ✅"); resetForm(); fetchUsers(); })
        .catch((err) => alert(err.response?.data?.message || "Error adding user"));
    }
  };

  const deleteUser = (id) => {
    if (!window.confirm("Delete this user?")) return;
    API.delete(`/admin/users/${id}`)
      .then(() => { toast.success("User Deleted ✅"); fetchUsers(); })
      .catch((err) => console.log(err));
  };

  return (
    <div className="users-container">
      <h2>👥 Users</h2>

      {/* Form */}
      <div style={{ background: "white", padding: "16px", borderRadius: "12px", marginBottom: "16px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
        <h3 style={{ marginBottom: "14px", fontSize: "15px" }}>
          {editId ? "✏️ Edit User" : "➕ Add New User"}
        </h3>
        <form onSubmit={handleSubmit}>
          <div className="user-form" style={{ marginBottom: "12px" }}>
            <input name="name" placeholder="Full Name *" value={form.name} onChange={handleChange} />
            <input name="email" placeholder="Email *" value={form.email} onChange={handleChange} />
            <input name="password" type="password" placeholder={editId ? "Password (optional)" : "Password *"} value={form.password} onChange={handleChange} />
            <input name="aadhaarNumber" placeholder="Aadhaar Number" value={form.aadhaarNumber} onChange={handleChange} />
            <input name="state" placeholder="State" value={form.state} onChange={handleChange} />
            <select name="gender" value={form.gender} onChange={handleChange}>
              <option value="female">Female</option>
              <option value="male">Male</option>
              <option value="other">Other</option>
            </select>
            <select name="role" value={form.role} onChange={handleChange}>
              <option value="user">User</option>
              <option value="admin">Admin</option>
              <option value="student">Student</option>
            </select>
          </div>
          <div style={{ display: "flex", gap: "10px" }}>
            <button type="submit" style={{ padding: "10px 20px", background: "#2563eb", color: "white", border: "none", borderRadius: "8px", fontWeight: "600", cursor: "pointer" }}>
              {editId ? "Update" : "Add User"}
            </button>
            {editId && (
              <button type="button" onClick={resetForm} style={{ padding: "10px 20px", background: "#6b7280", color: "white", border: "none", borderRadius: "8px", fontWeight: "600", cursor: "pointer" }}>
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Scrollable Table */}
      <div className="table-scroll">
        <table className="users-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>State</th>
              <th>Gender</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((u) => (
                <tr key={u._id}>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>{u.role}</td>
                  <td>{u.state || "—"}</td>
                  <td>{u.gender || "—"}</td>
                  <td>
                    <button onClick={() => handleEdit(u)}>Edit</button>
                    <button onClick={() => deleteUser(u._id)}>Delete</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="6" style={{ textAlign: "center", padding: "20px", color: "#9ca3af" }}>No Users Found</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Users;