import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const UserList = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/users/userlist");
        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, []);

  return (
    <div className="post">
      <h1>Danh sách người dùng</h1>
      <p>Bạn có thể xem những người dùng đã đăng kí ở đây</p>
      {users.length > 0 ? (
        <ul>
          {users.map((user) => (
            <li key={user._id}>
              <h2>{user.first_name} {user.last_name}</h2>
              <p>Location: {user.location}</p>
              <p>Description: {user.description}</p>
              <p>Occupation: {user.occupation}</p>
              <button onClick={() => navigate(`/userdetail/${user._id}`)}>
                Xem các ảnh đã đăng
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No users available.</p>
      )}
    </div>
  );
};

export default UserList;
