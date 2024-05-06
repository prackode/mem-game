import React, { useState } from 'react'
import axios from "axios"
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Signup = () => {
    const navigate = useNavigate();
    const [formdata, setFormdata] = useState({
        email: "",
        username: "",
        password: "",
        password2: ""
    })

    const handleOnchange = (e) => {
        setFormdata({ ...formdata, [e.target.name]: e.target.value })
    }

    const { email, username, password, password2 } = formdata

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const response = await axios.post('http://localhost:8000/api/register/', formdata)
            console.log(response.data)
            const result = response.data
            if (response.status === 201) {
                toast.success(result.message);
                navigate('/login');
            } else {
                toast.error('Something went wrong, please try again later');
            }
        } catch (error) {
            console.error('Registration failed:', error.response.data);
            const error_data = error.response.data;
            if ('email' in error_data && 'username' in error_data) {
                toast.error('User with these credentials already exists');
            } else if ('email' in error_data || 'username' in error_data) {
                if ('username' in error_data) {
                    toast.error('Please choose a different username')
                } else {
                    toast.error('User with these credentials already exists');
                }
            } else if ('password' in error_data || 'password2' in error_data) {
                toast.error('Please enter a valid password with atleast 6 characters');
            } else if ('error' in error_data) {
                toast.error('Passwords do not match')
            } else {
                toast.error('Something went wrong, please try again later');
            }

        }
    }

    return (
        <div>
            <div className='form-container'>
                <div style={{ width: "100%" }} className='wrapper'>
                    <h2>Create Account</h2>
                    <form action="" onSubmit={handleSubmit}>
                        <div className='form-group'>
                            <label htmlFor="">Email Address:</label>
                            <input type="text"
                                className='email-form'
                                name="email"
                                value={email}
                                onChange={handleOnchange} />
                        </div>
                        <div className='form-group'>
                            <label htmlFor="">Username:</label>
                            <input type="text"
                                className='email-form'
                                name="username"
                                value={username}
                                onChange={handleOnchange} />
                        </div>
                        <div className='form-group'>
                            <label htmlFor="">Password:</label>
                            <input type="password"
                                className='email-form'
                                name="password"
                                value={password}
                                onChange={handleOnchange} />
                        </div>
                        <div className='form-group'>
                            <label htmlFor="">Confirm Password:</label>
                            <input type="password"
                                className='p'
                                name="password2"
                                value={password2}
                                onChange={handleOnchange} />
                        </div>
                        <input type="submit" value="Submit" className="submitButton" />

                    </form>
                </div>
            </div>

        </div>
    )
}

export default Signup;