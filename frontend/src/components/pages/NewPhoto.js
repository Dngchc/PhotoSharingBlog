import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const NewPhoto = () => {
  const [photo, setPhoto] = useState(null);
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setPhoto(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!photo) {
      setError("Please select an image.");
      return;
    }

    const formData = new FormData();
    formData.append("photo", photo);
    formData.append("description", description);

    try {
      const response = await fetch("http://localhost:5000/api/photos/newphoto", {
        method: "POST",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        body: formData,
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || "Upload failed");
      }

      const data = await response.json();
      setSuccess("Photo uploaded successfully!");
      setPhoto(null);
      setDescription("");
      setTimeout(() => navigate("/photolist"), 1500); // Redirect sau khi upload thành công
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="new-photo">
      <h2>Upload New Photo</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div>
          <label>Select Photo:</label>
          <input type="file" accept="image/*" onChange={handleFileChange} />
        </div>
        <div>
          <label>Description:</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter description"
          />
        </div>
        <button type="submit">Upload</button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}
    </div>
  );
};

export default NewPhoto;
