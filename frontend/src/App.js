import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Navbar from "./components/navbar/Navbar";
import Home from "./components/navbar/Home";
import About from "./components/navbar/About";
import Login from "./components/navbar/Login";
import Register from "./components/pages/Register";
import UserList from "./components/pages/UserList";
import Photo from "./components/pages/Photo";
import NewPhoto from "./components/pages/NewPhoto";
import UserDetail from "./components/pages/UserDetail";
import PhotoDetail from "./components/pages/PhotoDetail";
function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Component bảo vệ route, chỉ cho phép truy cập khi đã đăng nhập
  const PrivateRoute = ({ children }) => {
    return isLoggedIn ? children : <Navigate to="/login" />;
  };

  return (
    <div className="App">
      <Router>
        <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          {/* Truyền setIsLoggedIn vào Login */}
          <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
          <Route path="/register" element={<Register />} />

          {/* Các route cần đăng nhập sẽ được bao bọc bởi PrivateRoute */}
          <Route
            path="/userlist"
            element={
              <PrivateRoute>
                <UserList />
              </PrivateRoute>
            }
          />
          <Route
            path="/photolist"
            element={
              <PrivateRoute>
                <Photo />
              </PrivateRoute>
            }
          />
          <Route
            path="/newphoto"
            element={
              <PrivateRoute>
                < NewPhoto />
              </PrivateRoute>
            }
          />
          <Route
            path="/userdetail/:id"
            element={
              <PrivateRoute>
                < UserDetail />
              </PrivateRoute>
            }
          />
          <Route
            path="/photodetail/:photoId"
            element={
              <PrivateRoute>
                < PhotoDetail />
              </PrivateRoute>
            }
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
