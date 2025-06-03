import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = ({ setIsLoggedIn }) => {
  const [login_name, setLoginName] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  
  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ login_name, password })
      });

      const data = await res.json();

      if (res.ok && data.user) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('lastname', data.user.last_name || '');
        if (typeof setIsLoggedIn === 'function') {
          setIsLoggedIn(true);
        }
        setMessage('✅ Đăng nhập thành công!');
        navigate('/');
      } else {
        setMessage('❌ Lỗi: ' + (data.message || 'Sai thông tin đăng nhập'));
      }
    } catch (err) {
      console.error('Lỗi kết nối server:', err);
      setMessage('❌ Không thể kết nối đến máy chủ. Vui lòng thử lại sau.');
    }
  };

  return (
    <div>
      <form onSubmit={handleLogin}>
        <h2>Đăng nhập</h2>
        {message && <p>{message}</p>}

        <div>
          <label htmlFor="login_name">Tên đăng nhập</label>
          <input
            id="login_name"
            type="text"
            value={login_name}
            placeholder="username"
            onChange={(e) => setLoginName(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="password">Mật khẩu</label>
          <input
            id="password"
            type="password"
            value={password}
            placeholder="password"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit">Đăng nhập</button>

        <p>
          Chưa có tài khoản? <a href="/register">Đăng ký</a>
        </p>
      </form>
    </div>
  );
};

export default Login;
