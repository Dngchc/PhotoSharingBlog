import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const PhotoDetail = () => {
  const { photoId } = useParams();

  const [photo, setPhoto] = useState(null);
  const [commentInput, setCommentInput] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPhoto = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/photos/detail/${photoId}`);
        if (!res.ok) throw new Error('Không lấy được chi tiết ảnh');
        const data = await res.json();
        setPhoto(data);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchPhoto();
  }, [photoId]);

  const handleAddComment = async () => {
    if (!commentInput.trim()) return;

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5000/api/photos/${photoId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token,
        },
        body: JSON.stringify({ comment: commentInput }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || 'Không thể gửi bình luận');
      }

      const newComment = await res.json();

      setPhoto(prev => ({
        ...prev,
        comments: [...(prev.comments || []), newComment]
      }));

      setCommentInput('');
    } catch (err) {
      alert(err.message);
    }
  };

  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!photo) return <p>Đang tải ảnh...</p>;

  return (
    <div>
      <h2>Chi tiết ảnh</h2>
      <p><b>Tác giả:</b> {photo.userId?.first_name} {photo.userId?.last_name}</p>
      <p><b>Thời gian đăng:</b> {new Date(photo.createdAt).toLocaleString('vi-VN')}</p>
      <p><b>Mô tả:</b> {photo.description || 'Không có mô tả'}</p>
      <img src={photo.url} alt={photo.description || 'Ảnh'} style={{ maxWidth: '400px' }} />

      <hr />

      <h3>Bình luận ({photo.comments?.length || 0})</h3>
      {(!photo.comments || photo.comments.length === 0) && <p>Chưa có bình luận nào.</p>}

      {photo.comments && photo.comments.map(cmt => (
        <div key={cmt._id} style={{ marginBottom: '10px' }}>
          <p><b>{cmt.userId?.first_name} {cmt.userId?.last_name}:</b> {cmt.comment}</p>
        </div>
      ))}

      <textarea
        rows="3"
        value={commentInput}
        onChange={e => setCommentInput(e.target.value)}
        placeholder="Viết bình luận..."
      />
      <br />
      <button onClick={handleAddComment}>Gửi bình luận</button>
    </div>
  );
};

export default PhotoDetail;
