import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const UserDetail = () => {
  const navigate = useNavigate();
  const { id: userId } = useParams();
  const [user, setUser] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUserAndPhotos = async () => {
      try {
        // Lấy thông tin người dùng
        const userRes = await fetch(`http://localhost:5000/api/users/${userId}`);
        if (!userRes.ok) throw new Error("Không thể lấy thông tin người dùng");
        const userData = await userRes.json();
        setUser(userData);

        // Lấy ảnh của người dùng
        const photoRes = await fetch(`http://localhost:5000/api/photos/user/${userId}`);
        if (!photoRes.ok) throw new Error("Không thể lấy ảnh");
        const photoData = await photoRes.json();
        setPhotos(photoData);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchUserAndPhotos();
  }, [userId]);

  const formatDate = (date) => {
    return new Date(date).toLocaleString('vi-VN');
  };

  const handleViewDetail = (photoId) => {
    navigate(`/photodetail/${photoId}`);
  };

  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="user-detail">
      <h1>Thông tin người dùng</h1>

      {user ? (
        <>
          <p>Họ tên: {user.first_name} {user.last_name}</p>
          <p>Vị trí: {user.location || "Không có"}</p>
          <p>Mô tả: {user.description || "Không có"}</p>
          <p>Nghề nghiệp: {user.occupation || "Không có"}</p>
        </>
      ) : (
        <p>Đang tải thông tin người dùng...</p>
      )}

      <hr />

      <h2>Ảnh đã đăng</h2>
      {photos.length > 0 ? (
        photos.map(photo => (
            <div key={photo._id} style={{ marginBottom: "20px", border: "1px solid #ccc", padding: "10px" }}>
            <p>{photo.description}</p>
            <img 
              src={photo.url} 
              alt={photo.description || "Ảnh"} 
              style={{ maxWidth: "300px", maxHeight: "300px", objectFit: "cover" }}
            />

            <p>Ngày đăng: {formatDate(photo.createdAt)}</p>
            <button onClick={() => handleViewDetail(photo._id)}>Xem chi tiết</button>
          </div>
        ))
      ) : (
        <p>Chưa có ảnh nào được đăng.</p>
      )}
    </div>
  );
};

export default UserDetail;
