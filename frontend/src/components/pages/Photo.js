import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom'; // <-- thêm dòng này

const Photo = () => {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // <-- thêm dòng này

  const fetchPhotos = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/photos/photolist');
      if (!response.ok) throw new Error('Failed to fetch photos');
      const data = await response.json();

      const sortedPhotos = data.sort((a, b) =>
        new Date(b.createdAt || b.date_time) - new Date(a.createdAt || a.date_time)
      );
      setPhotos(sortedPhotos);
    } catch (error) {
      console.error('Error fetching photos:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPhotos();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return 'Không có ngày';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleViewDetail = (photoId) => {
    navigate(`/photodetail/${photoId}`);
  };

  return (
    <div>
      <div>
        <h1>Danh Sách Ảnh</h1>
        <p>Tổng cộng: {photos.length} ảnh</p>
      </div>

      {photos.length > 0 ? (
        <div>
          {photos.map(photo => (
            <div key={photo._id} style={{ marginBottom: '30px', borderBottom: '1px solid #ddd', paddingBottom: '20px' }}>
              <div>
                <div>
                  <strong>{photo.userId?.first_name || 'Ẩn danh'} {photo.userId?.last_name || ''}</strong>
                </div>
                <div>{formatDate(photo.createdAt || photo.date_time)}</div>
              </div>

              {photo.title && <h3>{photo.title}</h3>}
              {photo.description && <p>{photo.description}</p>}

              <img
                src={photo.url}
                alt={photo.description || photo.title || "Photo"}
                style={{
                  maxWidth: '200px',
                  maxHeight: '200px',
                  width: 'auto',
                  height: 'auto',
                  borderRadius: '8px',
                  display: 'block',
                  marginTop: '10px',
                  marginBottom: '10px'
                }}
              />

              <div>
                <div>{photo.comments ? `${photo.comments.length} bình luận` : '0 bình luận'}</div>

                <button onClick={() => handleViewDetail(photo._id)}>
                  Xem chi tiết
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div>
          <p>Chưa có ảnh nào được đăng tải.</p>
        </div>
      )}
    </div>
  );
};

export default Photo;
