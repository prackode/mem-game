import React, { useState } from 'react'
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import AxiosInstance from "../../utils/AxiosInstance";

const Login = () => {
    const navigate = useNavigate()
    const [logindata, setLogindata] = useState({
        username: "",
        password: ""
    })

    const handleOnchange = (e) => {
        setLogindata({ ...logindata, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (logindata.username && logindata.password) {
            try {
                const res = await AxiosInstance.post('/login/', logindata)
                const response = res.data
                const user = {
                    'username': response.username,
                    'email': response.email
                }

                if (res.status === 200) {
                    localStorage.setItem('token', JSON.stringify(response.access_token))
                    localStorage.setItem('refresh_token', JSON.stringify(response.refresh_token))
                    localStorage.setItem('user', JSON.stringify(user))
                    navigate('/')
                    toast.success('Logged in successfully')
                } else {
                    console.log(response);
                    toast.error('Something went wrong, please try again later')
                }
            }
            catch (error) {
                console.error('Login failed:', error.response.data);
                const error_data = error.response.data;
                if ('detail' in error_data) {
                    toast.error(error_data.detail);
                } else {
                    toast.error('Something went wrong, please try again later');
                }
            }
        } else {
            toast.warn('Please fill all the required details')
        }
    }

    return (
        <div>
            <div className='form-container'>
                <div style={{ width: "100%" }} className='wrapper'>
                    <h2>Login</h2>
                    <form action="" onSubmit={handleSubmit}>
                        <div className='form-group'>
                            <label htmlFor="">Username:</label>
                            <input type="text"
                                className='email-form'
                                value={logindata.username}
                                name="username"
                                onChange={handleOnchange} />

                        </div>

                        <div className='form-group'>
                            <label htmlFor="">Password:</label>
                            <input type="password"
                                className='email-form'
                                value={logindata.password}
                                name="password"
                                onChange={handleOnchange} />
                        </div>

                        <input type="submit" value="Login" className="submitButton" />
                    </form>
                </div>
            </div>

        </div>
    )
}

export default Login