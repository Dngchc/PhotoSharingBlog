import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    login_name: '',
    password: '',
    confirmPassword: '',
    first_name: '',
    last_name: '',
    location: '',
    description: '',
    occupation: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("❌ Mật khẩu xác nhận không khớp");
      return;
    }

    const { confirmPassword, ...submitData } = formData;

    try {
      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submitData)
      });

      if (res.ok) {
        alert('✅ Đăng ký thành công!');
        navigate('/login');
      } else {
        const error = await res.json();
        alert('❌ Lỗi: ' + (error.message || 'Đăng ký thất bại'));
      }
    } catch (err) {
      alert('❌ Lỗi mạng!');
      console.error(err);
    }
  };

  return (
    <div className="register">
      <h1>Register</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="first_name">First Name:</label>
          <input type="text" id="first_name" name="first_name" required onChange={handleChange} />
        </div>
        <div>
          <label htmlFor="last_name">Last Name:</label>
          <input type="text" id="last_name" name="last_name" required onChange={handleChange} />
        </div>
        <div>
          <label htmlFor="location">Location:</label>
          <input type="text" id="location" name="location" onChange={handleChange} />
        </div>
        <div>
          <label htmlFor="description">Description:</label>
          <input type="text" id="description" name="description" onChange={handleChange} />
        </div>
        <div>
          <label htmlFor="occupation">Occupation:</label>
          <input type="text" id="occupation" name="occupation" onChange={handleChange} />
        </div>
        <div>
          <label htmlFor="login_name">Username:</label>
          <input type="text" id="login_name" name="login_name" required onChange={handleChange} />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input type="password" id="password" name="password" required onChange={handleChange} />
        </div>
        <div>
          <label htmlFor="confirmPassword">Confirm Password:</label>
          <input type="password" id="confirmPassword" name="confirmPassword" required onChange={handleChange} />
        </div>
        <br />
        <button type="submit">Register</button>
        <br />
        <a href="/login">Already have an account? Login here</a>
      </form>
    </div>
  );
};

export default Register;
