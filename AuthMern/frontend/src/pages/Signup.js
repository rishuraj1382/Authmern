 import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify';
import { handleError, handleSuccess } from '../utils';

function Signup() {

    const [signupInfo, setSignupInfo] = useState({
        name: '',
        email: '',
        password: ''
    })

    const navigate = useNavigate();
    const handleChange = (e) => {
        const { name, value } = e.target;
        console.log(name, value);
        const copySignupInfo = { ...signupInfo };
        copySignupInfo[name] = value;
        setSignupInfo(copySignupInfo);
    }

    const handleSignup = async (e) => {
        e.preventDefault();
        const { name, email, password } = signupInfo;
        if (!name || !email || !password) {
            return handleError('name, email and password are required')
        }
        try {
            const url = `https://deploy-mern-app-1-api.vercel.app/auth/signup`;
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(signupInfo)
            });
            const result = await response.json();
            const { success, message, error } = result;
            if (success) {
                handleSuccess(message);
                setTimeout(() => {
                    navigate('/login')
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
        <div className="signup-container">
            <form className="form" onSubmit={handleSignup}>
                <p className="title">Register</p>
                <p className="message">Signup now and get full access to our app.</p>
                
                <label>
                    <input
                        required
                        placeholder=""
                        type="text"
                        className="input"
                        name="name"
                        value={signupInfo.name}
                        onChange={handleChange}
                    />
                    <span>Name</span>
                </label>

                <label>
                    <input
                        required
                        type="email"
                        className="input"
                        name="email"
                        value={signupInfo.email}
                        onChange={handleChange}
                    />
                    <span>Email</span>
                </label>

                <label>
                    <input
                        required
                        type="password"
                        className="input"
                        name="password"
                        value={signupInfo.password}
                        onChange={handleChange}
                    />
                    <span>Password</span>
                </label>

                <button type="submit" className="submit">Submit</button>

                <Link to='/' className='submit'>Login</Link>
            </form>
            <ToastContainer />
        </div>
    )
}

export default Signup;
