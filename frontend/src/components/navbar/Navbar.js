import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = ({ isLoggedIn, setIsLoggedIn }) => {
  const navigate = useNavigate();
  const username = localStorage.getItem("lastname");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("lastname");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <Link to="/">Home</Link> |{" "}
      <Link to="/about">About</Link> |{" "}

      {!isLoggedIn ? (
        <>
          <Link to="/login">Login</Link> |{" "}
          <span>Please login!</span>
        </>
      ) : (
        <>
          <Link to="/userlist">User List</Link> |{" "}
          <Link to="/photolist">Photo</Link> |{" "}
          <Link to="/newphoto">New Photo</Link> |{" "}
          <span>Xin chào, {username}!</span> |{" "}
          <button onClick={handleLogout}>Logout</button>
        </>
      )}
    </nav>
  );
};

export default Navbar;
