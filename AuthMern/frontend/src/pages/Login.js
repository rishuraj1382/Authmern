import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify';
import { handleError, handleSuccess } from '../utils';

function Login() {

    const [loginInfo, setLoginInfo] = useState({
        email: '',
        password: ''
    })

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        console.log(name, value);
        const copyLoginInfo = { ...loginInfo };
        copyLoginInfo[name] = value;
        setLoginInfo(copyLoginInfo);
    }

    const handleLogin = async (e) => {
        e.preventDefault();
        const { email, password } = loginInfo;
        if (!email || !password) {
            return handleError('email and password are required')
        }
        try {
            const url = `https://deploy-mern-app-1-api.vercel.app/auth/login`;
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(loginInfo)
            });
            const result = await response.json();
            const { success, message, jwtToken, name, error } = result;
            if (success) {
                handleSuccess(message);
                localStorage.setItem('token', jwtToken);
                localStorage.setItem('loggedInUser', name);
                setTimeout(() => {
                    navigate('/home')
                }, 1000)
            } else if (error) {
                const details = error?.details[0].message;
                handleError(details);
            } else if (!success) {
                handleError(message);
            }
            console.log(result);
        } catch (err) {
            handleError(err);
        }
    }

  return (
    <div className="login-container">
      <form className="form" onSubmit={handleLogin}>
        <p className="title">Login</p>

        <label>
          <input
            required={true}
            name="email"
            type="email"
            className="input"
            onChange={handleChange}
          />
          <span>Email</span>
        </label>

        <label>
          <input
            required={true}
            name="password"
            type="password"
            className="input"
            onChange={handleChange}
          />
          <span>Password</span>
        </label>
        <button type="submit" className="submit">
          Submit
        </button>
        <p> Don't have an account?</p>
        <Link to="/signup" className="submitt">
          Signup Here
        </Link>
      </form>
      <ToastContainer />
    </div>
  );
}

export default Login;
